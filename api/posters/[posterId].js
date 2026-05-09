import { connectDB, Poster } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { posterId } = req.query;
    const id = parseInt(posterId, 10);

    if (!id || id < 1 || id > 5) {
      return res.status(400).json({ error: 'Invalid poster ID (must be 1-5)' });
    }

    const poster = await Poster.findOne({ posterId: id }).lean();
    if (!poster) {
      return res.status(404).json({ error: 'Poster not found' });
    }

    return res.status(200).json({ poster });
  } catch (err) {
    console.error('Poster detail error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
