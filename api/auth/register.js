import { connectDB, User } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { nickname, phone, deviceId } = req.body;

    if (!nickname || !phone) {
      return res.status(400).json({ error: 'Nickname and phone are required' });
    }

    // Find existing user or create new one
    let user = await User.findOne({ phone });
    if (user) {
      // Update nickname/device if changed
      user.nickname = nickname;
      if (deviceId) user.deviceId = deviceId;
      await user.save();
    } else {
      user = await User.create({ nickname, phone, deviceId: deviceId || '' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        nickname: user.nickname,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
