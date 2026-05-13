import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'

function Results() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [analyticsRes, pollRes] = await Promise.all([
          API.get(`/analytics/${id}`),
          API.get(`/polls/${id}`)
        ])
        setData(analyticsRes.data)
        setPoll(pollRes.data.poll)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [id])

  const getPercentage = (count, total) => {
    if (total === 0) return 0
    return Math.round((count / total) * 100)
  }

  return <ResultsUI data={data} poll={poll} loading={loading} getPercentage={getPercentage} />
}

function ResultsUI({ data, poll, loading, getPercentage }) {

  if (loading) return (
    <div style={{ background: '#f0eeea', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="label-text">Loading results...</div>
    </div>
  )

  return (
    <div style={{ background: '#f0eeea', minHeight: '100vh' }}>

      <nav className="navbar">
        <a className="nav-logo" href="/">Pollify</a>
        <div className="nav-links">
          <span className="label-text">Final Results</span>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '140px 48px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '64px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '40px' }}>
          <div className="label-text" style={{ marginBottom: '12px' }}>✦ Final Results</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 64px)', letterSpacing: '-2px', textTransform: 'uppercase', lineHeight: 0.95, color: '#0a0a0a', marginBottom: '16px' }}>
            {poll?.title}
          </div>
          {poll?.description && (
            <div style={{ fontSize: '15px', color: '#888', lineHeight: 1.7 }}>{poll.description}</div>
          )}
        </div>

        {/* Total responses */}
        <div style={{ background: '#0a0a0a', padding: '32px', marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="label-text" style={{ color: 'rgba(240,238,234,0.4)' }}>Total Responses</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '48px', letterSpacing: '-2px', color: '#f0eeea', lineHeight: 1 }}>
            {data?.totalResponses || 0}
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '48px' }}>
          {data?.questions?.map((q, qi) => {
            const total = q.options.reduce((sum, o) => sum + o.count, 0)
            const winner = [...q.options].sort((a, b) => b.count - a.count)[0]

            return (
              <div key={q.question_id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '36px' }}>

                <div style={{ marginBottom: '28px' }}>
                  <div className="label-text" style={{ marginBottom: '8px' }}>Question {qi + 1}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#0a0a0a', lineHeight: 1.2 }}>
                    {q.question_text}
                  </div>
                </div>

                {/* Winner highlight */}
                {winner && total > 0 && (
                  <div style={{ background: '#0a0a0a', padding: '20px 24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="label-text" style={{ color: 'rgba(240,238,234,0.4)', marginBottom: '4px' }}>Winner</div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', color: '#f0eeea', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                        {winner.text}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', color: '#f0eeea', letterSpacing: '-1px' }}>
                      {getPercentage(winner.count, total)}%
                    </div>
                  </div>
                )}

                {/* All options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {q.options
                    .sort((a, b) => b.count - a.count)
                    .map((opt, oi) => {
                      const pct = getPercentage(opt.count, total)
                      const isWinner = oi === 0 && total > 0
                      return (
                        <div key={opt.option_id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: isWinner ? 700 : 400, color: '#0a0a0a' }}>{opt.text}</span>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', color: '#888' }}>{opt.count} votes</span>
                              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '16px', color: '#0a0a0a' }}>{pct}%</span>
                            </div>
                          </div>
                          <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: isWinner ? '#0a0a0a' : 'rgba(0,0,0,0.15)', transition: 'width 0.8s ease' }} />
                          </div>
                        </div>
                      )
                    })}
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default Results