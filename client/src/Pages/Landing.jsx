import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Landing() {
  const { user } = useAuth()

  return (
    <div style={{ background: '#f0eeea', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="navbar">
        <a className="nav-logo" href="/">Pollify</a>
        <div className="nav-links">
          <a className="nav-link" href="#how">How it works</a>
          <a className="nav-link" href="#features">Features</a>
          {user
            ? <Link className="nav-btn" to="/dashboard">Dashboard →</Link>
            : <>
                <Link className="nav-link" to="/login">Sign in</Link>
                <Link className="nav-btn" to="/register">Get Started</Link>
              </>
          }
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '160px', paddingBottom: '120px', paddingLeft: '48px', paddingRight: '48px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="label-text" style={{ marginBottom: '32px' }}>
            ✦ The modern polling platform
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: '40px' }}>
            <div className="display-heading">
              CREATE.<br />
              SHARE.<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px #0a0a0a' }}>DECIDE.</span>
            </div>  
            <div style={{ maxWidth: '320px', paddingBottom: '12px' }}>
              <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.7, marginBottom: '32px' }}>
                Build powerful polls in seconds. Share with anyone. Get real-time insights that actually matter.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '16px 32px' }}>
                  Start Free →
                </Link>
                <a href="#how" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600', color: '#888', textDecoration: 'none', borderBottom: '1px solid #ccc', paddingBottom: '2px' }}>
                  See how it works
                </a>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(0,0,0,0.08)', marginTop: '80px', paddingTop: '40px', gap: '40px' }}>
            {[
              { number: '10K+', label: 'Polls Created' },
              { number: '500K+', label: 'Responses Collected' },
              { number: '99%', label: 'Satisfaction Rate' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', letterSpacing: '-1px', color: '#0a0a0a', lineHeight: 1 }}>{stat.number}</div>
                <div className="label-text" style={{ marginTop: '8px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section style={{ padding: '20px 0', background: '#0a0a0a', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: '48px', animation: 'marquee 20s linear infinite', whiteSpace: 'nowrap' }}>
          {['Create Polls', 'Share Links', 'Collect Responses', 'View Analytics', 'Publish Results', 'Real-Time Updates', 'Anonymous Voting', 'Multiple Questions', 'Create Polls', 'Share Links', 'Collect Responses', 'View Analytics'].map((text, i) => (
            <span key={i} style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: i % 2 === 0 ? '#f0eeea' : 'rgba(240,238,234,0.3)', fontWeight: 600, flexShrink: 0 }}>
              {text} ✦
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '120px 48px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
            <div className="label-text">How it works</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-1.5px', textTransform: 'uppercase', lineHeight: 1, textAlign: 'right' }}>
              THREE STEPS.<br />
              <span style={{ color: 'black' }}>THAT'S IT.</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {[
              { step: '01', title: 'Create', desc: 'Build your poll with multiple questions, set options, expiry time and choose anonymous or authenticated responses.' },
              { step: '02', title: 'Share', desc: 'Get a unique public link instantly. Share it anywhere — email, Slack, WhatsApp, anywhere your audience is.' },
              { step: '03', title: 'Analyse', desc: 'Watch responses come in live. View breakdowns, option counts and insights. Publish results when ready.' },
            ].map((item, i) => (
              <div key={i} style={{ background: i === 1 ? '#0a0a0a' : '#f0eeea', padding: '48px 40px', border: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '72px', lineHeight: 1, color: i === 1 ? 'rgba(240,238,234,0.15)' : 'rgba(0,0,0,0.08)', marginBottom: '40px' }}>{item.step}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.5px', textTransform: 'uppercase', color: i === 1 ? '#f0eeea' : '#0a0a0a', marginBottom: '16px' }}>{item.title}</div>
                <div style={{ fontSize: '14px', color: i === 1 ? 'rgba(240,238,234,0.5)' : '#888', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '120px 48px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="label-text" style={{ marginBottom: '24px' }}>Features</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-1.5px', textTransform: 'uppercase', lineHeight: 1, marginBottom: '80px' }}>
            EVERYTHING YOU<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #0a0a0a' }}>NEED.</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px' }}>
            {[
              { icon: '⚡', title: 'Real-Time Analytics', desc: 'Watch votes come in live with WebSocket-powered updates. No refresh needed.' },
              { icon: '🔒', title: 'Anonymous Responses', desc: 'Let respondents answer without signing in. Full privacy when you need it.' },
              { icon: '⏱', title: 'Poll Expiry', desc: 'Set an expiry time on any poll. It automatically closes when time runs out.' },
              { icon: '📊', title: 'Publish Results', desc: 'Make results public with one click. Anyone with the link can see the outcome.' },
            ].map((f, i) => (
              <div key={i} style={{ padding: '48px 40px', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '28px', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.3px', textTransform: 'uppercase', color: '#0a0a0a', marginBottom: '10px' }}>{f.title}</div>
                  <div style={{ fontSize: '14px', color: '#888', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
            
      <section style={{ padding: '140px 48px', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '280px', color: 'rgba(255,255,255,0.02)', letterSpacing: '-8px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>POLLIFY</div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="label-text" style={{ color: 'rgba(240,238,234,0.3)', marginBottom: '32px' }}>Ready to start?</div>

            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(48px, 8vw, 112px)', letterSpacing: '-3px', textTransform: 'uppercase', lineHeight: 0.9, color: '#f0eeea', marginBottom: '48px' }}>
              START<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(240,238,234,0.25)' }}>POLLING</span><br />
              TODAY.
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ display: 'inline-block', padding: '20px 56px', background: '#f0eeea', color: '#0a0a0a', textDecoration: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
                Create Free Account →
              </Link>

              <a href="#how" style={{ display: 'inline-flex', alignItems: 'center', padding: '20px 40px', border: '1px solid rgba(240,238,234,0.15)', color: 'rgba(240,238,234,0.5)', textDecoration: 'none', fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer style={{ padding: '32px 48px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '14px', color: '#f0eeea', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>Pollify</span>
        <span style={{ fontSize: '11px', color: 'rgba(240,238,234,0.3)', letterSpacing: '1px' }}>© 2026 — All rights reserved</span>
      </footer>

      {/* Marquee animation */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .navbar { padding: 20px 24px !important; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>

    </div>
  )
}

export default Landing  
