import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { adminRequest } from '../utils/api.js'

export default function Admin() {
  const [adminKey, setAdminKey] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [tab, setTab] = useState('dashboard')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async (action, key) => {
    setLoading(true)
    setError('')
    try {
      const result = await adminRequest(action, key || adminKey)
      if (result.error === 'Unauthorized') {
        setError('Буруу нууц үг!')
        setAuthenticated(false)
        return null
      }
      return result
    } catch (err) {
      setError('Сервертэй холбогдож чадсангүй')
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await fetchData('dashboard', adminKey)
    if (result && !result.error) {
      setAuthenticated(true)
      setData(result)
      setTab('dashboard')
    }
  }

  const switchTab = async (newTab) => {
    setTab(newTab)
    const actionMap = { dashboard: 'dashboard', users: 'users', collections: 'collections' }
    if (actionMap[newTab]) {
      const result = await fetchData(actionMap[newTab])
      if (result) setData(result)
    }
  }

  const handleExport = async () => {
    try {
      const result = await adminRequest('export', adminKey)
      if (result.blob) {
        const url = URL.createObjectURL(result.blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'collections.csv'; a.click()
        URL.revokeObjectURL(url)
      }
    } catch { setError('Export failed') }
  }

  const handleToggle = async (posterId) => {
    await adminRequest('toggle-poster', adminKey, { method: 'PATCH', body: { posterId } })
    switchTab('dashboard')
  }

  // Login screen
  if (!authenticated) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-strong animate-scale-in" style={{ padding: 32, maxWidth: 380, width: '100%' }}>
            <h2 className="gold-text" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>
              ⚙️ Admin Panel
            </h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input className="input-field" type="password" placeholder="Admin нууц үг"
                value={adminKey} onChange={e => setAdminKey(e.target.value)} />
              {error && <p style={{ color: 'var(--color-neon-orange)', fontSize: '0.85rem', textAlign: 'center' }}>⚠️ {error}</p>}
              <button type="submit" className="btn-gold" disabled={loading}>
                {loading ? '⏳...' : '🔑 Нэвтрэх'}
              </button>
            </form>
          </div>
        </div>
      </>
    )
  }

  // Dashboard
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '80px 20px 40px', maxWidth: 900, margin: '0 auto' }}>
        <h1 className="gold-text" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 24 }}>
          ⚙️ Admin Dashboard
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['dashboard', 'users', 'collections'].map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={tab === t ? 'btn-gold' : 'btn-outline'}
              style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              {t === 'dashboard' ? '📊 Dashboard' : t === 'users' ? '👥 Users' : '💰 Collections'}
            </button>
          ))}
          <button onClick={handleExport} className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            📥 Export CSV
          </button>
        </div>

        {loading && <p style={{ textAlign: 'center', padding: 40 }}>⏳ Ачаалж байна...</p>}

        {/* Dashboard Tab */}
        {tab === 'dashboard' && data && !loading && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
              <div className="stat-card">
                <div className="gold-text" style={{ fontSize: '2rem', fontWeight: 900 }}>{data.userCount || 0}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(232,234,246,0.5)' }}>Нийт тоглогчид</div>
              </div>
              <div className="stat-card">
                <div className="gold-text" style={{ fontSize: '2rem', fontWeight: 900 }}>{data.collectionCount || 0}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(232,234,246,0.5)' }}>Цуглуулсан</div>
              </div>
              <div className="stat-card">
                <div className="gold-text" style={{ fontSize: '2rem', fontWeight: 900 }}>{(data.totalPrize || 0).toLocaleString()}₮</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(232,234,246,0.5)' }}>Нийт шагнал</div>
              </div>
            </div>

            {/* Posters table */}
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>📌 Постерууд</h3>
            <div className="glass" style={{ overflow: 'auto', marginBottom: 24 }}>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Нэр</th><th>Шагнал</th><th>QR</th><th>Төлөв</th><th></th></tr></thead>
                <tbody>
                  {(data.posters || []).map(p => (
                    <tr key={p.posterId}>
                      <td>{p.posterId}</td>
                      <td>{p.title}</td>
                      <td>{p.prizeAmount?.toLocaleString()}₮</td>
                      <td>
                        <a href={`/qr-codes/poster-${p.posterId}.png`} target="_blank" rel="noreferrer"
                          style={{ color: 'var(--color-neon-blue)', fontSize: '0.8rem' }}>
                          📷 Харах
                        </a>
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                          background: p.isActive ? 'rgba(0,255,136,0.15)' : 'rgba(255,107,53,0.15)',
                          color: p.isActive ? 'var(--color-neon-green)' : 'var(--color-neon-orange)',
                        }}>
                          {p.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleToggle(p.posterId)}
                          style={{
                            background: 'none', border: '1px solid rgba(255,215,0,0.2)',
                            color: 'var(--color-gold-400)', padding: '4px 10px', borderRadius: 6,
                            cursor: 'pointer', fontSize: '0.75rem',
                          }}>
                          {p.isActive ? 'Идэвхгүй болгох' : 'Идэвхжүүлэх'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && data && !loading && (
          <div className="glass" style={{ overflow: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Хоч нэр</th><th>Утас</th><th>Бүртгүүлсэн</th></tr></thead>
              <tbody>
                {(data.users || []).map(u => (
                  <tr key={u._id}>
                    <td>{u.nickname}</td>
                    <td>{u.phone}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(!data.users || data.users.length === 0) && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24 }}>Тоглогч байхгүй</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Collections Tab */}
        {tab === 'collections' && data && !loading && (
          <div className="glass" style={{ overflow: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Тоглогч</th><th>Постер</th><th>Шагнал</th><th>Огноо</th></tr></thead>
              <tbody>
                {(data.collections || []).map(c => (
                  <tr key={c._id}>
                    <td>{c.userId?.nickname || '—'} ({c.userId?.phone || '—'})</td>
                    <td>Poster #{c.posterId}</td>
                    <td>{c.prizeAmount?.toLocaleString()}₮</td>
                    <td>{new Date(c.collectedAt).toLocaleString()}</td>
                  </tr>
                ))}
                {(!data.collections || data.collections.length === 0) && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24 }}>Цуглуулга байхгүй</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
