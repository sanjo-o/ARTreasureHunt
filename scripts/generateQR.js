/**
 * QR Code Generator for AR Treasure Hunt
 * Generates 5 unique QR codes for each poster
 * 
 * Usage: node scripts/generateQR.js
 * Optional: node scripts/generateQR.js https://your-domain.vercel.app
 */
import QRCode from 'qrcode';
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.argv[2] || process.env.BASE_URL || 'https://your-app.vercel.app';
const OUTPUT_DIR = join(__dirname, '..', 'public', 'qr-codes');

const POSTERS = [
  { id: 1, title: 'Golden Eagle Nest' },
  { id: 2, title: 'Steppe Wind Temple' },
  { id: 3, title: 'Khan\'s Hidden Vault' },
  { id: 4, title: 'Nomad\'s Ancient Well' },
  { id: 5, title: 'Eternal Blue Sky Gate' },
];

async function generateQRCodes() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('\n🏆 AR Treasure Hunt — QR Code Generator\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  for (const poster of POSTERS) {
    const url = `${BASE_URL}/hunt/poster/${poster.id}`;
    const filename = `poster-${poster.id}.png`;
    const filepath = join(OUTPUT_DIR, filename);

    // Generate QR with gold-themed colors
    await QRCode.toFile(filepath, url, {
      type: 'png',
      width: 512,
      margin: 2,
      color: {
        dark: '#1a1a2e',   // Dark navy dots
        light: '#ffffff',  // White background
      },
      errorCorrectionLevel: 'H', // High error correction
    });

    // Also generate SVG version (lightweight for web)
    const svgPath = join(OUTPUT_DIR, `poster-${poster.id}.svg`);
    await QRCode.toFile(svgPath, url, {
      type: 'svg',
      width: 512,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });

    // Generate data URL for inline embedding
    const dataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });

    console.log(`  ✅ Poster ${poster.id}: "${poster.title}"`);
    console.log(`     URL: ${url}`);
    console.log(`     PNG: ${filepath}`);
    console.log(`     SVG: ${svgPath}\n`);
  }

  // Generate a JSON manifest of all posters
  const manifest = POSTERS.map(p => ({
    id: p.id,
    title: p.title,
    url: `${BASE_URL}/hunt/poster/${p.id}`,
    qrPng: `/qr-codes/poster-${p.id}.png`,
    qrSvg: `/qr-codes/poster-${p.id}.svg`,
    prizeAmount: 100000,
  }));

  writeFileSync(
    join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`📋 Manifest saved: ${join(OUTPUT_DIR, 'manifest.json')}`);
  console.log('\n🎉 All 5 QR codes generated!\n');
}

generateQRCodes().catch(console.error);
