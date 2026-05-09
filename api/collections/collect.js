import { connectDB, Collection, Poster, User } from '../_db.js';

// Simple in-memory rate limiter (resets on cold start, good enough for anti-spam)
const rateMap = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { userId, posterId, deviceInfo } = req.body;

    // ── Validate inputs ──
    if (!userId || !posterId) {
      return res.status(400).json({ error: 'userId and posterId are required' });
    }

    const pid = parseInt(posterId, 10);
    if (!pid || pid < 1 || pid > 5) {
      return res.status(400).json({ error: 'Invalid poster ID (must be 1-5)' });
    }

    // ── Rate limiting by device/user (1 collect per 10 seconds) ──
    const rateKey = `${userId}-${pid}`;
    const now = Date.now();
    if (rateMap.has(rateKey) && now - rateMap.get(rateKey) < 10000) {
      return res.status(429).json({ error: 'Too many requests. Wait 10 seconds.' });
    }
    rateMap.set(rateKey, now);

    // ── Check user exists ──
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    // ── Check poster exists and is active ──
    const poster = await Poster.findOne({ posterId: pid });
    if (!poster) {
      return res.status(404).json({ error: 'Poster not found' });
    }
    if (!poster.isActive) {
      return res.status(403).json({ error: 'This treasure is no longer available.' });
    }

    // ── Check duplicate collection (anti-cheat) ──
    const existing = await Collection.findOne({ userId, posterId: pid });
    if (existing) {
      return res.status(409).json({
        error: 'already_collected',
        message: 'Та энэ эрдэнэсийг аль хэдийн цуглуулсан байна. (You already collected this treasure.)',
        collectedAt: existing.collectedAt,
      });
    }

    // ── Collect treasure ──
    const collection = await Collection.create({
      userId,
      posterId: pid,
      prizeAmount: poster.prizeAmount,
      deviceInfo: deviceInfo || req.headers['user-agent'] || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Баяр хүргэе! Та 100,000₮ эрдэнэс олсон! (Congratulations! You found 100,000₮ treasure!)',
      collection: {
        id: collection._id,
        posterId: pid,
        posterTitle: poster.title,
        prizeAmount: poster.prizeAmount,
        collectedAt: collection.collectedAt,
      },
    });
  } catch (err) {
    // MongoDB duplicate key error (race condition safety net)
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'already_collected',
        message: 'You already collected this treasure.',
      });
    }
    console.error('Collect error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
