import { connectDB, Poster } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const posters = await Poster.find().sort({ posterId: 1 }).lean();
    return res.status(200).json({ posters });
  } catch (err) {
    console.error('Posters error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
