import { Link, useLocation } from 'react-router-dom'
import { getPlayer } from '../utils/api.js'

export default function Navbar() {
  const location = useLocation()
  const player = getPlayer()

  // Hide navbar on AR hunt & scan pages
  if (location.pathname.startsWith('/hunt/poster/') || location.pathname === '/scan') return null

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.5rem' }}>💰</span>
          <span className="gold-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>
            AR Treasure
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {player && (
          <Link to="/profile" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            👤 {player.nickname}
          </Link>
        )}
        <Link to="/admin" style={{
          color: 'rgba(232,234,246,0.5)',
          fontSize: '0.8rem',
          textDecoration: 'none',
        }}>
          ⚙️
        </Link>
      </div>
    </nav>
  )
}
