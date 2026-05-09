import { useState } from 'react'
import { registerUser, savePlayer, getDeviceId } from '../utils/api.js'

export default function PlayerForm({ onRegistered }) {
  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!nickname.trim() || !phone.trim()) {
      setError('Нэр болон утасны дугаараа оруулна уу')
      return
    }

    setLoading(true)
    try {
      const data = await registerUser(nickname.trim(), phone.trim(), getDeviceId())
      if (data.error) {
        setError(data.error)
      } else {
        savePlayer(data.user)
        onRegistered(data.user)
      }
    } catch (err) {
      setError('Сервертэй холбогдож чадсангүй. Дахин оролдоно уу.')
    }
    setLoading(false)
  }

  return (
    <div className="animate-slide-up" style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
      <div className="glass-strong" style={{ padding: 32 }}>
        <h2 className="gold-text" style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>
          🏆 Тоглогч бүртгэл
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(232,234,246,0.6)', fontSize: '0.9rem', marginBottom: 24 }}>
          Эрдэнэс цуглуулахын тулд бүртгүүлнэ үү
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--color-gold-400)' }}>
              Хоч нэр (Nickname)
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Жич: Баатар"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={30}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--color-gold-400)' }}>
              Утасны дугаар (Phone)
            </label>
            <input
              className="input-field"
              type="tel"
              placeholder="99119911"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={15}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--color-neon-orange)', fontSize: '0.85rem', textAlign: 'center' }}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-gold"
            disabled={loading}
            style={{ marginTop: 8, width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Ачаалж байна...' : '🎯 Бүртгүүлэх'}
          </button>
        </form>
      </div>
    </div>
  )
}
