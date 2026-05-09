import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function Home() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Hero Section */}
        <section style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '100px 20px 40px', textAlign: 'center',
        }}>
          {/* Floating treasure emoji */}
          <div className="animate-float" style={{ fontSize: '5rem', marginBottom: 24 }}>
            💰
          </div>

          {/* Title */}
          <h1 className="gold-text" style={{
            fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 900,
            lineHeight: 1.1, marginBottom: 16,
          }}>
            AR Treasure Hunt
          </h1>

          <p style={{
            color: 'var(--color-neon-blue)', fontSize: '1.1rem',
            fontWeight: 600, marginBottom: 8,
          }}>
            🏆 5 Постер • 5 Эрдэнэс • 500,000₮
          </p>

          <p style={{
            color: 'rgba(232,234,246,0.6)', fontSize: '0.95rem',
            maxWidth: 500, marginBottom: 40, lineHeight: 1.6,
          }}>
            Постер дээрх QR кодыг уншуулж, AR эрдэнэсийн авдрыг олоорой!
            Авдар бүрт 100,000₮ шагнал байна.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/hunt/poster/1" className="btn-gold">
              🎯 Эрдэнэс хайх
            </Link>
            <Link to="/profile" className="btn-outline">
              👤 Миний профайл
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: '40px 20px 60px', maxWidth: 600, margin: '0 auto', width: '100%' }}>
          <h2 className="gold-text" style={{
            fontSize: '1.5rem', fontWeight: 800,
            textAlign: 'center', marginBottom: 32,
          }}>
            Яаж тоглох вэ?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { emoji: '📱', title: 'QR код уншуулах', desc: 'Постер дээрх QR кодыг утасны камераар уншуулна' },
              { emoji: '🎯', title: 'AR тоглоом нээгдэнэ', desc: 'Камер нээгдэж 3D эрдэнэсийн авдар харагдана' },
              { emoji: '👆', title: 'Авдрыг нээх', desc: 'Авдар дээр дарж эрдэнэсийг цуглуулна' },
              { emoji: '🏆', title: 'Шагнал авах', desc: '100,000₮ эрдэнэс таны дансанд нэмэгдэнэ!' },
            ].map((step, i) => (
              <div key={i} className="glass animate-slide-up" style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: 20, animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{
                  fontSize: '2rem', width: 56, height: 56,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 12, background: 'rgba(255,215,0,0.1)',
                  flexShrink: 0,
                }}>
                  {step.emoji}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: '1rem' }}>{step.title}</h3>
                  <p style={{ color: 'rgba(232,234,246,0.5)', fontSize: '0.85rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Poster List */}
        <section style={{ padding: '0 20px 60px', maxWidth: 600, margin: '0 auto', width: '100%' }}>
          <h2 className="gold-text" style={{
            fontSize: '1.5rem', fontWeight: 800,
            textAlign: 'center', marginBottom: 24,
          }}>
            🗺️ 5 Эрдэнэсийн газрууд
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { id: 1, name: 'Golden Eagle Nest', emoji: '🦅' },
              { id: 2, name: 'Steppe Wind Temple', emoji: '🏛️' },
              { id: 3, name: "Khan's Hidden Vault", emoji: '👑' },
              { id: 4, name: "Nomad's Ancient Well", emoji: '⛲' },
              { id: 5, name: 'Eternal Blue Sky Gate', emoji: '🌌' },
            ].map(p => (
              <Link key={p.id} to={`/hunt/poster/${p.id}`} className="glass" style={{
                padding: 16, textAlign: 'center', textDecoration: 'none',
                color: 'inherit', transition: 'border-color 0.3s',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{p.emoji}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', marginTop: 4 }}>
                  100,000₮
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '20px', textAlign: 'center',
          borderTop: '1px solid rgba(255,215,0,0.1)',
          color: 'rgba(232,234,246,0.3)', fontSize: '0.8rem',
        }}>
          AR Treasure Hunt © 2026
        </footer>
      </div>
    </>
  )
}
