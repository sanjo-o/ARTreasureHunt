const API_BASE = '/api';

export async function registerUser(nickname, phone, deviceId) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, phone, deviceId }),
  });
  return res.json();
}

export async function getPoster(posterId) {
  const res = await fetch(`${API_BASE}/posters/${posterId}`);
  return res.json();
}

export async function getAllPosters() {
  const res = await fetch(`${API_BASE}/posters`);
  return res.json();
}

export async function collectTreasure(userId, posterId, deviceInfo) {
  const res = await fetch(`${API_BASE}/collections/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, posterId, deviceInfo }),
  });
  return { status: res.status, ...(await res.json()) };
}

export async function getUserCollections(userId) {
  const res = await fetch(`${API_BASE}/collections/${userId}`);
  return res.json();
}

export async function adminRequest(action, adminKey, options = {}) {
  const res = await fetch(`${API_BASE}/admin/${action}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  if (action === 'export') {
    return { blob: await res.blob() };
  }
  return res.json();
}

export function getDeviceInfo() {
  return navigator.userAgent;
}

// Simple device fingerprint (not cryptographic, just anti-spam)
export function getDeviceId() {
  let id = localStorage.getItem('ar_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('ar_device_id', id);
  }
  return id;
}

// Player session (stored in localStorage)
export function savePlayer(player) {
  localStorage.setItem('ar_player', JSON.stringify(player));
}

export function getPlayer() {
  try {
    return JSON.parse(localStorage.getItem('ar_player'));
  } catch {
    return null;
  }
}

export function clearPlayer() {
  localStorage.removeItem('ar_player');
}
