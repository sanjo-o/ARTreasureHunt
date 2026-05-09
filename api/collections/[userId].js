import { connectDB, Collection } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const collections = await Collection.find({ userId })
      .sort({ collectedAt: -1 })
      .lean();

    const totalPrize = collections.reduce((sum, c) => sum + c.prizeAmount, 0);

    return res.status(200).json({
      collections,
      totalPrize,
      count: collections.length,
    });
  } catch (err) {
    console.error('User collections error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
