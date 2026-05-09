import mongoose from 'mongoose';

let cached = global.__mongoConn;
if (!cached) cached = global.__mongoConn = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// ── User Schema ──
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  phone: { type: String, required: true },
  deviceId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});
userSchema.index({ phone: 1 }, { unique: true });

// ── Poster Schema ──
const posterSchema = new mongoose.Schema({
  posterId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  qrCodeUrl: { type: String, default: '' },
  prizeAmount: { type: Number, default: 100000 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// ── Collection Schema ──
const collectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  posterId: { type: Number, required: true },
  prizeAmount: { type: Number, required: true },
  collectedAt: { type: Date, default: Date.now },
  deviceInfo: { type: String, default: '' },
});
collectionSchema.index({ userId: 1, posterId: 1 }, { unique: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Poster = mongoose.models.Poster || mongoose.model('Poster', posterSchema);
export const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);
