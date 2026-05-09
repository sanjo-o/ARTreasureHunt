import { playSuccessSound } from '../utils/sounds.js'
import { useEffect } from 'react'

export default function PrizeCard({ posterTitle, prizeAmount, onClose }) {
  useEffect(() => {
    playSuccessSound()
  }, [])

  return (
    <div className="prize-overlay" onClick={onClose}>
      <div className="prize-card" onClick={(e) => e.stopPropagation()}>
        {/* Floating coins decoration */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="coin-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              '--duration': `${2 + Math.random() * 2}s`,
              '--delay': `${Math.random() * 2}s`,
            }}
          />
        ))}

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Trophy emoji */}
          <div style={{ fontSize: '4rem', marginBottom: 16 }} className="animate-float">
            🏆
          </div>

          {/* Congratulations */}
          <h2 className="gold-text" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 8 }}>
            Баяр хүргэе!
          </h2>
          <p style={{ color: 'rgba(232,234,246,0.7)', marginBottom: 20, fontSize: '0.95rem' }}>
            {posterTitle}
          </p>

          {/* Prize amount */}
          <div
            className="animate-pulse-gold mongolian-border"
            style={{
              padding: '20px 24px',
              borderRadius: 16,
              margin: '0 auto 24px',
              maxWidth: 260,
            }}
          >
            <div style={{ fontSize: '2.2rem', fontWeight: 900 }} className="gold-text">
              {(prizeAmount || 100000).toLocaleString()}₮
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-neon-blue)', marginTop: 4 }}>
              Treasure Found!
            </div>
          </div>

          {/* Close button */}
          <button
            className="btn-gold"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            ✨ Үргэлжлүүлэх
          </button>
        </div>
      </div>
    </div>
  )
}
