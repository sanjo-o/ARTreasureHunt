import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import ARScene from '../components/ARScene.jsx'
import PlayerForm from '../components/PlayerForm.jsx'
import PrizeCard from '../components/PrizeCard.jsx'
import { getPlayer, collectTreasure, getDeviceInfo } from '../utils/api.js'
import { playCoinSound } from '../utils/sounds.js'

const POSTER_NAMES = {
  1: 'Golden Eagle Nest', 2: 'Steppe Wind Temple',
  3: "Khan's Hidden Vault", 4: "Nomad's Ancient Well",
  5: 'Eternal Blue Sky Gate',
}

export default function HuntPoster() {
  const { posterId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const pid = parseInt(posterId, 10)

  const [player, setPlayer] = useState(getPlayer())
  const [phase, setPhase] = useState('loading') // loading | register | ar | prize | error | already
  const [error, setError] = useState('')
  const [prizeData, setPrizeData] = useState(null)

  // Validate poster ID & enforce scanner
  useEffect(() => {
    // FORCE users to use the active web scanner
    if (!location.state?.scanned) {
      navigate('/scan', { replace: true })
      return
    }

    if (!pid || pid < 1 || pid > 5) {
      setPhase('error')
      setError('Буруу постерийн ID! (1-5 байх ёстой)')
      return
    }
    if (!player) {
      setPhase('register')
    } else {
      setPhase('ar')
    }
  }, [pid, player])

  const handleRegistered = (userData) => {
    setPlayer(userData)
    setPhase('ar')
  }

  const handleCollect = async () => {
    try {
      playCoinSound()
      const result = await collectTreasure(player.id, pid, getDeviceInfo())

      if (result.status === 409) {
        setPhase('already')
        return
      }
      if (result.error && result.error !== 'already_collected') {
        setError(result.error || result.message)
        setPhase('error')
        return
      }
      if (result.success) {
        setPrizeData(result.collection)
        setPhase('prize')
      }
    } catch (err) {
      // If API is not connected, show demo prize
      setPrizeData({ posterTitle: POSTER_NAMES[pid], prizeAmount: 100000 })
      setPhase('prize')
    }
  }

  // Loading
  if (phase === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-float" style={{ fontSize: '3rem' }}>💰</div>
      </div>
    )
  }

  // Error
  if (phase === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="glass-strong animate-scale-in" style={{ padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ marginBottom: 12, fontWeight: 700 }}>Алдаа гарлаа</h2>
          <p style={{ color: 'rgba(232,234,246,0.6)', marginBottom: 24 }}>{error}</p>
          <Link to="/" className="btn-gold">🏠 Нүүр хуудас</Link>
        </div>
      </div>
    )
  }

  // Already collected
  if (phase === 'already') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="glass-strong animate-scale-in" style={{ padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <h2 className="gold-text" style={{ marginBottom: 12, fontWeight: 800 }}>Аль хэдийн цуглуулсан</h2>
          <p style={{ color: 'rgba(232,234,246,0.6)', marginBottom: 8 }}>
            Та "{POSTER_NAMES[pid]}" эрдэнэсийг аль хэдийн цуглуулсан байна.
          </p>
          <p style={{ color: 'var(--color-neon-blue)', fontSize: '0.85rem', marginBottom: 24 }}>
            Бусад постеруудын QR кодыг уншуулж шинэ эрдэнэс олоорой!
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn-gold">🏠 Нүүр хуудас</Link>
            <Link to="/profile" className="btn-outline">👤 Профайл</Link>
          </div>
        </div>
      </div>
    )
  }

  // Register
  if (phase === 'register') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div className="animate-float" style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</div>
            <h2 className="gold-text" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              Poster #{pid}: {POSTER_NAMES[pid]}
            </h2>
          </div>
          <PlayerForm onRegistered={handleRegistered} />
        </div>
      </div>
    )
  }

  // AR Scene
  return (
    <>
      <ARScene onCollect={handleCollect} />
      {phase === 'prize' && prizeData && (
        <PrizeCard
          posterTitle={prizeData.posterTitle || POSTER_NAMES[pid]}
          prizeAmount={prizeData.prizeAmount || 100000}
          onClose={() => navigate('/profile')}
        />
      )}
    </>
  )
}
