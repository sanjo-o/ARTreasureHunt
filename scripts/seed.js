/**
 * Database Seed Script
 * Seeds 5 poster records into MongoDB
 * 
 * Usage: MONGODB_URI=... node scripts/seed.js
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ar-treasure-hunt';

const PosterSchema = new mongoose.Schema({
  posterId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  qrCodeUrl: { type: String },
  prizeAmount: { type: Number, default: 100000 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Poster = mongoose.model('Poster', PosterSchema);

const POSTERS = [
  { posterId: 1, title: 'Golden Eagle Nest', prizeAmount: 100000 },
  { posterId: 2, title: 'Steppe Wind Temple', prizeAmount: 100000 },
  { posterId: 3, title: "Khan's Hidden Vault", prizeAmount: 100000 },
  { posterId: 4, title: "Nomad's Ancient Well", prizeAmount: 100000 },
  { posterId: 5, title: 'Eternal Blue Sky Gate', prizeAmount: 100000 },
];

async function seed() {
  console.log('\n🌱 Seeding database...\n');
  await mongoose.connect(MONGODB_URI);

  for (const poster of POSTERS) {
    await Poster.findOneAndUpdate(
      { posterId: poster.posterId },
      { ...poster, qrCodeUrl: `/qr-codes/poster-${poster.posterId}.png` },
      { upsert: true, new: true }
    );
    console.log(`  ✅ Poster ${poster.posterId}: "${poster.title}" — ${poster.prizeAmount.toLocaleString()}₮`);
  }

  console.log('\n🎉 Database seeded with 5 posters!\n');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
