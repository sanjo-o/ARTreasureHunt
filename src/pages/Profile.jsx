import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { getPlayer, getUserCollections } from '../utils/api.js'

const POSTER_NAMES = {
  1: 'Golden Eagle Nest', 2: 'Steppe Wind Temple',
  3: "Khan's Hidden Vault", 4: "Nomad's Ancient Well",
  5: 'Eternal Blue Sky Gate',
}
const POSTER_EMOJIS = { 1: '🦅', 2: '🏛️', 3: '👑', 4: '⛲', 5: '🌌' }

export default function Profile() {
  const player = getPlayer()
  const [collections, setCollections] = useState([])
  const [totalPrize, setTotalPrize] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!player) { setLoading(false); return }
    getUserCollections(player.id)
      .then(data => {
        setCollections(data.collections || [])
        setTotalPrize(data.totalPrize || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!player) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, paddingTop: 80 }}>
          <div className="glass-strong animate-scale-in" style={{ padding: 32, textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>👤</div>
            <h2 style={{ marginBottom: 12, fontWeight: 700 }}>Нэвтрэх шаардлагатай</h2>
            <p style={{ color: 'rgba(232,234,246,0.6)', marginBottom: 24 }}>
              QR код уншуулж бүртгүүлнэ үү
            </p>
            <Link to="/" className="btn-gold">🏠 Нүүр хуудас</Link>
          </div>
        </div>
      </>
    )
  }

  const collectedIds = new Set(collections.map(c => c.posterId))

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '80px 20px 40px', maxWidth: 600, margin: '0 auto' }}>
        {/* Player info */}
        <div className="glass-strong animate-slide-up" style={{ padding: 24, marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>👤</div>
          <h1 className="gold-text" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>
            {player.nickname}
          </h1>
          <p style={{ color: 'rgba(232,234,246,0.5)', fontSize: '0.85rem' }}>📱 {player.phone}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="gold-text" style={{ fontSize: '2rem', fontWeight: 900 }}>
              {collections.length}/5
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(232,234,246,0.5)', marginTop: 4 }}>
              Олсон эрдэнэс
            </div>
          </div>
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="gold-text" style={{ fontSize: '2rem', fontWeight: 900 }}>
              {totalPrize.toLocaleString()}₮
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(232,234,246,0.5)', marginTop: 4 }}>
              Нийт шагнал
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="glass" style={{ padding: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Явц</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-gold-400)' }}>
              {Math.round((collections.length / 5) * 100)}%
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,215,0,0.1)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${(collections.length / 5) * 100}%`,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Poster grid */}
        <h2 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1.1rem' }}>🗺️ Бүх постерууд</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4, 5].map(id => {
            const found = collectedIds.has(id)
            return (
              <div key={id} className="glass" style={{
                padding: 16, display: 'flex', alignItems: 'center', gap: 16,
                opacity: found ? 1 : 0.5,
              }}>
                <div style={{
                  fontSize: '1.8rem', width: 48, height: 48,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 12, background: found ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                }}>
                  {POSTER_EMOJIS[id]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {found ? '✅ ' : '🔒 '}{POSTER_NAMES[id]}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: found ? 'var(--color-gold-400)' : 'rgba(232,234,246,0.3)' }}>
                    {found ? '100,000₮ цуглуулсан' : 'Олдоогүй'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
