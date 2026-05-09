import { connectDB, User, Poster, Collection } from '../_db.js';

export default async function handler(req, res) {
  // ── Admin auth check ──
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await connectDB();
  const { action } = req.query;

  try {
    switch (action) {
      case 'dashboard': {
        const [userCount, collectionCount, posters] = await Promise.all([
          User.countDocuments(),
          Collection.countDocuments(),
          Poster.find().sort({ posterId: 1 }).lean(),
        ]);
        const totalPrize = await Collection.aggregate([
          { $group: { _id: null, total: { $sum: '$prizeAmount' } } },
        ]);
        return res.status(200).json({
          userCount,
          collectionCount,
          totalPrize: totalPrize[0]?.total || 0,
          posters,
        });
      }

      case 'users': {
        const users = await User.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json({ users });
      }

      case 'collections': {
        const collections = await Collection.find()
          .populate('userId', 'nickname phone')
          .sort({ collectedAt: -1 })
          .lean();
        return res.status(200).json({ collections });
      }

      case 'export': {
        const collections = await Collection.find()
          .populate('userId', 'nickname phone')
          .sort({ collectedAt: -1 })
          .lean();

        // Build CSV
        const header = 'ID,Nickname,Phone,PosterId,PrizeAmount,CollectedAt,DeviceInfo\n';
        const rows = collections.map(c =>
          `${c._id},${c.userId?.nickname || ''},${c.userId?.phone || ''},${c.posterId},${c.prizeAmount},${c.collectedAt},${(c.deviceInfo || '').replace(/,/g, ';')}`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=collections.csv');
        return res.status(200).send(header + rows);
      }

      case 'toggle-poster': {
        if (req.method !== 'PATCH') return res.status(405).json({ error: 'Use PATCH' });
        const { posterId } = req.body;
        const poster = await Poster.findOne({ posterId: parseInt(posterId, 10) });
        if (!poster) return res.status(404).json({ error: 'Poster not found' });
        poster.isActive = !poster.isActive;
        await poster.save();
        return res.status(200).json({ poster });
      }

      default:
        return res.status(400).json({ error: 'Invalid action. Use: dashboard, users, collections, export, toggle-poster' });
    }
  } catch (err) {
    console.error('Admin error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
