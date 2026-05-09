# 🏆 AR Treasure Hunt

> Scan posters, find treasure chests, win 100,000₮ prizes!

A cross-platform Web AR treasure hunt game. Players scan QR codes on 5 real-world posters to discover and collect virtual treasure chests. Works on Android and iPhone browsers — no app installation needed.

## 🎯 Features

- **AR Treasure Chests** — 3D procedural chest with open animation + coin burst
- **Camera AR Mode** — Camera background with Three.js overlay (works on both Android & iOS)
- **5 Unique Posters** — Each with its own QR code and treasure
- **Anti-Cheat** — Duplicate collection prevention, rate limiting
- **Player System** — Phone + nickname registration, collection history
- **Admin Dashboard** — Stats, user management, CSV export, poster toggle
- **Mongolian Theme** — Gold, neon, glassmorphism, animated design

## 📁 Project Structure

```
├── api/                    # Vercel Serverless Functions (Backend)
│   ├── _db.js              # MongoDB connection + Mongoose models
│   ├── auth/register.js    # Player registration
│   ├── posters/            # Poster API
│   ├── collections/        # Treasure collection API
│   └── admin/[action].js   # Admin dashboard API
├── src/                    # React Frontend
│   ├── components/         # ARScene, TreasureChest, CoinEffect, etc.
│   ├── pages/              # Home, HuntPoster, Profile, Admin
│   └── utils/              # API client, sounds, device info
├── public/qr-codes/        # Generated QR code images
├── scripts/                # QR generator + DB seeder
└── vercel.json             # Vercel deployment config
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier: [mongodb.com/atlas](https://www.mongodb.com/atlas))

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values:
# MONGODB_URI=mongodb+srv://...
# BASE_URL=https://your-app.vercel.app
# ADMIN_KEY=your-secret-admin-password
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Generate QR Codes
```bash
npm run generate-qr https://your-app.vercel.app
```
QR codes will be saved in `public/qr-codes/`

### 5. Seed Database
```bash
MONGODB_URI=your-connection-string npm run seed
```

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "AR Treasure Hunt"
git remote add origin https://github.com/YOUR_USER/ar-treasure-hunt.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Add environment variables in Vercel dashboard:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `ADMIN_KEY` — your admin password
3. Click **Deploy**

### Step 3: Update QR Codes
After deployment, regenerate QR codes with your actual Vercel URL:
```bash
npm run generate-qr https://your-app-name.vercel.app
```
Then redeploy (push the updated QR code files).

## 📱 How It Works

1. **Player scans QR code** on a physical poster
2. **Browser opens** `/hunt/poster/:id`
3. **Player registers** (nickname + phone) if first time
4. **AR scene launches** — camera feed + 3D treasure chest
5. **Player taps chest** — it opens with animation + coins + sound
6. **Prize collected** — 100,000₮ recorded in database
7. **Profile page** shows collection progress (X/5 found)

## 🔒 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register/login player |
| GET | `/api/posters` | List all posters |
| GET | `/api/posters/:id` | Get poster details |
| POST | `/api/collections/collect` | Collect treasure |
| GET | `/api/collections/:userId` | User's collection history |
| GET | `/api/admin/dashboard` | Admin stats (requires X-Admin-Key header) |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/collections` | All collections |
| GET | `/api/admin/export` | Export CSV |
| PATCH | `/api/admin/toggle-poster` | Toggle poster active/inactive |

## 🛡️ Anti-Cheat

- **Unique constraint** on (userId + posterId) prevents double collection
- **Rate limiter** — max 1 collection per 10 seconds per user/device
- **Server-side validation** — posterId must be 1-5 and poster must be active
- **Device fingerprinting** — tracks browser fingerprint for spam detection

## 🎨 Design Theme

- **Colors**: Deep navy (#0a0a0f) + Gold (#FFD700) + Neon blue (#00d4ff)
- **Font**: Outfit (Google Fonts)
- **Effects**: Glassmorphism, floating animations, glow, shimmer
- **Style**: Mongolian treasure hunt × Modern neon UI
