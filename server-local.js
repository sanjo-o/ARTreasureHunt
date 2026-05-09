import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Import Vercel handlers
import authRegister from './api/auth/register.js';
import postersIndex from './api/posters/index.js';
import posterDetail from './api/posters/[posterId].js';
import collectTreasure from './api/collections/collect.js';
import userCollections from './api/collections/[userId].js';
import adminAction from './api/admin/[action].js';

const app = express();

app.use(cors());
app.use(express.json());

console.log('🚀 Starting local dev API server...');

// Auth
app.post('/api/auth/register', authRegister);

// Posters
app.get('/api/posters', postersIndex);
app.get('/api/posters/:posterId', (req, res) => {
  req.query.posterId = req.params.posterId;
  return posterDetail(req, res);
});

// Collections
app.post('/api/collections/collect', collectTreasure);
app.get('/api/collections/:userId', (req, res) => {
  req.query.userId = req.params.userId;
  return userCollections(req, res);
});

// Admin
app.all('/api/admin/:action', (req, res) => {
  req.query.action = req.params.action;
  return adminAction(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Local dev API server running on http://localhost:${PORT}`);
});
