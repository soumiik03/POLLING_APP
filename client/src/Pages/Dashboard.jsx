import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function Dashboard() {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await API.get('/polls/my')
        setPolls(res.data.polls)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPolls()
  }, [])

  const handleCopy = (pollId) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${pollId}`)
    setCopied(pollId)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = async (pollId) => {
    if (!window.confirm('Delete this poll?')) return
    try {
      await API.delete(`/polls/${pollId}`)
      setPolls(polls.filter(p => p._id !== pollId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return <DashboardUI
    polls={polls}
    loading={loading}
    copied={copied}
    user={user}
    onCopy={handleCopy}
    onDelete={handleDelete}
    onLogout={handleLogout}
    navigate={navigate}
  />
}

function DashboardUI({ polls, loading, copied, user, onCopy, onDelete, onLogout, navigate }) {

  const getStatus = (poll) => {
    if (poll.is_closed) return { label: 'Closed', color: '#888' }
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) return { label: 'Expired', color: '#c0392b' }
    if (poll.is_published) return { label: 'Published', color: '#27ae60' }
    return { label: 'Active', color: '#2980b9' }
  }

  return (
    <div style={{ background: '#f0eeea', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="navbar">
        <a className="nav-logo" href="/">Pollify</a>
        <div className="nav-links">
          <span className="nav-link">Hey, {user?.username} 👋</span>
          <button onClick={onLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '140px 48px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '40px' }}>
          <div>
            <div className="label-text" style={{ marginBottom: '12px' }}>My Workspace</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 4vw, 56px)', letterSpacing: '-1.5px', textTransform: 'uppercase', lineHeight: 1, color: '#0a0a0a' }}>
              YOUR<br />POLLS.
            </div>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="btn-primary"
            style={{ width: 'auto', padding: '16px 32px' }}
          >
            + New Poll
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="label-text">Loading your polls...</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && polls.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', letterSpacing: '-1px', textTransform: 'uppercase', color: 'rgba(0,0,0,0.08)', marginBottom: '16px' }}>
              NO POLLS YET
            </div>
            <div style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>
              Create your first poll and start collecting responses
            </div>
            <button onClick={() => navigate('/create')} className="btn-primary" style={{ width: 'auto', padding: '14px 28px' }}>
              Create First Poll →
            </button>
          </div>
        )}

        {/* Poll Grid */}
        {!loading && polls.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2px' }}>
            {polls.map((poll, i) => {
              const status = getStatus(poll)
              return (
                <div key={poll._id} style={{ background: i % 3 === 1 ? '#0a0a0a' : '#f0eeea', border: '1px solid rgba(0,0,0,0.08)', padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px', transition: 'transform 0.2s' }}>

                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status.color }} />
                      <span style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: i % 3 === 1 ? 'rgba(240,238,234,0.4)' : '#888', fontWeight: 600 }}>
                        {status.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', letterSpacing: '1px', color: i % 3 === 1 ? 'rgba(240,238,234,0.3)' : '#aaa' }}>
                      {new Date(poll.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', textTransform: 'uppercase', color: i % 3 === 1 ? '#f0eeea' : '#0a0a0a', lineHeight: 1.1, marginBottom: '8px' }}>
                      {poll.title}
                    </div>
                    {poll.description && (
                      <div style={{ fontSize: '13px', color: i % 3 === 1 ? 'rgba(240,238,234,0.4)' : '#888', lineHeight: 1.6 }}>
                        {poll.description}
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {poll.expires_at && (
                      <div>
                        <div style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: i % 3 === 1 ? 'rgba(240,238,234,0.3)' : '#aaa', marginBottom: '3px' }}>Expires</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: i % 3 === 1 ? '#f0eeea' : '#0a0a0a' }}>
                          {new Date(poll.expires_at).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: i % 3 === 1 ? 'rgba(240,238,234,0.3)' : '#aaa', marginBottom: '3px' }}>Anonymous</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: i % 3 === 1 ? '#f0eeea' : '#0a0a0a' }}>
                        {poll.is_anonymous ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${i % 3 === 1 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                    <button
                      onClick={() => onCopy(poll._id)}
                      style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${i % 3 === 1 ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, color: i % 3 === 1 ? '#f0eeea' : '#0a0a0a', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {copied === poll._id ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={() => navigate(`/analytics/${poll._id}`)}
                      style={{ flex: 1, padding: '10px', background: i % 3 === 1 ? '#f0eeea' : '#0a0a0a', border: 'none', color: i % 3 === 1 ? '#0a0a0a' : '#f0eeea', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => onDelete(poll._id)}
                      style={{ padding: '10px 14px', background: 'transparent', border: '1px solid rgba(192,57,43,0.3)', color: '#c0392b', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}



export default Dashboard

