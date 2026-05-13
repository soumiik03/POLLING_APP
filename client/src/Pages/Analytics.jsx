import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useSocket } from '../hooks/useSocket'

function Analytics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [copied, setCopied] = useState(false)

  // 1. Fetch analytics on load
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsRes, pollRes] = await Promise.all([
          API.get(`/analytics/${id}`),
          API.get(`/polls/${id}`)
        ])
        setData(analyticsRes.data)
        setPoll(pollRes.data.poll)
        setPublished(pollRes.data.poll.is_published)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [id])

  // 2. Calculate percentage
  const getPercentage = (count, total) => {
    if (total === 0) return 0
    return Math.round((count / total) * 100)
  }

  // 3. Publish results
  const handlePublish = async () => {
    if (!window.confirm('Publish results? Anyone with the link can view them.')) return
    setPublishing(true)
    try {
      await API.patch(`/polls/${id}/publish`)
      setPublished(true)
    } catch (err) {
      console.error(err)
    } finally {
      setPublishing(false)
    }
  }
  useSocket(id, () => {
  // Refetch analytics when new response comes in
  API.get(`/analytics/${id}`).then(res => setData(res.data))
  })

  return <AnalyticsUI
    data={data}
    poll={poll}
    loading={loading}
    publishing={publishing}
    published={published}
    getPercentage={getPercentage}
    onPublish={handlePublish}
    onBack={() => navigate('/dashboard')}
    pollId={id}
  />
}

function AnalyticsUI({ data, poll, loading, publishing, published, getPercentage, onPublish, onBack, pollId }) {
  const [copied, setCopied] = useState(false)
  if (loading) return (
    <div style={{ background: '#f0eeea', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="label-text">Loading analytics...</div>
    </div>
  )

  return (
    <div style={{ background: '#f0eeea', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="navbar">
        <a className="nav-logo" href="/">Pollify</a>
        <div className="nav-links">
          <button onClick={onBack} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Dashboard
          </button>
          {!published ? (
            <button onClick={onPublish} className="nav-btn" disabled={publishing}>
              {publishing ? 'Publishing...' : 'Publish Results →'}
            </button>
          ) : (
            <span style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#27ae60', fontWeight: 700 }}>
              ✓ Published
            </span>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '140px 48px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '64px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '40px' }}>
          <div className="label-text" style={{ marginBottom: '12px' }}>Analytics</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-1.5px', textTransform: 'uppercase', lineHeight: 1, color: '#0a0a0a', marginBottom: '16px' }}>
            {poll?.title}
          </div>
          {published && (
            <div style={{ display: 'inline-block', padding: '6px 16px', background: '#0a0a0a', color: '#f0eeea', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700 }}>
              Results Published
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginBottom: '64px' }}>
          {[
            { label: 'Total Responses', value: data?.totalResponses || 0 },
            { label: 'Questions', value: data?.questions?.length || 0 },
            { label: 'Status', value: published ? 'Published' : 'Active' },
          ].map((stat, i) => (
            <div key={i} style={{ background: i === 0 ? '#0a0a0a' : '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '32px 28px' }}>
              <div className="label-text" style={{ marginBottom: '12px', color: i === 0 ? 'rgba(240,238,234,0.4)' : '#aaa' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', letterSpacing: '-1px', color: i === 0 ? '#f0eeea' : '#0a0a0a', lineHeight: 1 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Questions breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {data?.questions?.map((q, qi) => {
            const total = q.options.reduce((sum, o) => sum + o.count, 0)
            const topOption = [...q.options].sort((a, b) => b.count - a.count)[0]

            return (
              <div key={q.question_id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '36px' }}>

                {/* Question header */}
                <div style={{ marginBottom: '28px' }}>
                  <div className="label-text" style={{ marginBottom: '8px' }}>Question {qi + 1}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.3px', textTransform: 'uppercase', color: '#0a0a0a', lineHeight: 1.2 }}>
                    {q.question_text}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                    {total} response{total !== 1 ? 's' : ''}
                    {topOption && total > 0 && ` · Leading: ${topOption.text}`}
                  </div>
                </div>

                {/* Options with bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {q.options
                    .sort((a, b) => b.count - a.count)
                    .map((opt, oi) => {
                      const pct = getPercentage(opt.count, total)
                      const isTop = oi === 0 && total > 0
                      return (
                        <div key={opt.option_id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {isTop && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0a0a0a' }} />}
                              <span style={{ fontSize: '13px', fontWeight: isTop ? 700 : 400, color: '#0a0a0a' }}>{opt.text}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '12px', color: '#888' }}>{opt.count} votes</span>
                              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '16px', color: '#0a0a0a', minWidth: '40px', textAlign: 'right' }}>{pct}%</span>
                            </div>
                          </div>
                          <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '0' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: isTop ? '#0a0a0a' : 'rgba(0,0,0,0.2)', transition: 'width 0.6s ease' }} />
                          </div>
                        </div>
                      )
                    })}
                </div>

              </div>
            )
          })}
        </div>

        {/* Share section */}
        {published && (
          <div style={{ marginTop: '48px', padding: '32px', background: '#0a0a0a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="label-text" style={{ color: 'rgba(240,238,234,0.4)', marginBottom: '6px' }}>Results are public</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', color: '#f0eeea', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>
                Share the results
              </div>
            </div>
            <button
              onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/poll/${pollId}`)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
              }}
              style={{ padding: '14px 28px', background: '#f0eeea', border: 'none', color: '#0a0a0a', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              {copied ? 'Copied! ✓' : 'Copy Link →'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Analytics
