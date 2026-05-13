import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

function TakePoll() {
  const { id } = useParams()
  const navigate = useNavigate() 
  const [poll, setPoll] = useState(null)
  const [questions, setQuestions] = useState([])
  const [options, setOptions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [pollError, setPollError] = useState('')

  // 1. Fetch poll on load
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await API.get(`/polls/${id}`)
        setPoll(res.data.poll)
        setQuestions(res.data.questions)
        setOptions(res.data.options)
        
        if (res.data.poll.is_published) {
          navigate(`/results/${id}`)
        }
        if (res.data.isExpired) {
          setPollError('This poll has expired and is no longer accepting responses.')
        }
        if (res.data.poll.is_closed) {
          setPollError('This poll is closed.')
        }
      } catch (err) {
        setPollError('Poll not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchPoll()
  }, [id])

  // 2. Select an answer
  const handleSelect = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId })
  }

  // 3. Submit answers
  const handleSubmit = async () => {
    // Validate mandatory questions
    const mandatory = questions.filter(q => q.is_mandatory)
    const unanswered = mandatory.filter(q => !answers[q._id])
    if (unanswered.length > 0) {
      return setError('Please answer all mandatory questions.')
    }

    setSubmitting(true)
    setError('')

    try {
      const answersArray = Object.entries(answers).map(([question_id, option_id]) => ({
        question_id,
        option_id
      }))
      await API.post(`/responses/${id}`, { answers: answersArray })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  // 4. Get options for a specific question
  const getOptionsForQuestion = (questionId) => {
  return options.filter(o => o.question_id.toString() === questionId.toString())
  } 

  return <TakePollUI
    poll={poll}
    questions={questions}
    answers={answers}
    loading={loading}
    submitting={submitting}
    submitted={submitted}
    error={error}
    pollError={pollError}
    onSelect={handleSelect}
    onSubmit={handleSubmit}
    getOptionsForQuestion={getOptionsForQuestion}
  />
}

function TakePollUI({ poll, questions, answers, loading, submitting, submitted, error, pollError, onSelect, onSubmit, getOptionsForQuestion }) {

  // Loading
  if (loading) return (
    <div style={{ background: '#f0eeea', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="label-text">Loading poll...</div>
    </div>
  )

  // Poll error (expired, closed, not found)
  if (pollError) return (
    <div style={{ background: '#f0eeea', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', letterSpacing: '-1px', textTransform: 'uppercase', color: 'rgba(0,0,0,0.12)', marginBottom: '16px' }}>UNAVAILABLE</div>
        <div style={{ fontSize: '15px', color: '#888' }}>{pollError}</div>
      </div>
    </div>
  )

  // Success screen
  if (submitted) return (
    <div style={{ background: '#f0eeea', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(42px, 6vw, 72px)', letterSpacing: '-2px', textTransform: 'uppercase', lineHeight: 0.95, color: '#0a0a0a', marginBottom: '24px' }}>
          RESPONSE<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '2px #0a0a0a' }}>RECORDED.</span>
        </div>
        <div style={{ fontSize: '15px', color: '#888', lineHeight: 1.7, marginBottom: '40px' }}>
          Your response has been submitted successfully. Thank you for participating.
        </div>
        <a href="/" style={{ display: 'inline-block', padding: '16px 32px', background: '#0a0a0a', color: '#f0eeea', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
          Go to Pollify →
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#f0eeea', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="navbar">
        <a className="nav-logo" href="/">Pollify</a>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '140px 48px 80px' }}>

        {/* Poll Header */}
        <div style={{ marginBottom: '64px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '40px' }}>
          <div className="label-text" style={{ marginBottom: '12px' }}>
            {poll?.is_anonymous ? 'Anonymous Poll' : 'Authenticated Poll'} ✦ {questions.length} Question{questions.length !== 1 ? 's' : ''}
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-1.5px', textTransform: 'uppercase', lineHeight: 1, color: '#0a0a0a', marginBottom: '16px' }}>
            {poll?.title}
          </div>
          {poll?.description && (
            <div style={{ fontSize: '15px', color: '#888', lineHeight: 1.7 }}>{poll.description}</div>
          )}
        </div>

        {/* Error */}
        {error && <div className="error-msg" style={{ marginBottom: '32px' }}>{error}</div>}

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '48px' }}>
          {questions.map((q, qi) => (
            <div key={q._id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '36px' }}>

              {/* Question */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <div className="label-text" style={{ marginBottom: '8px' }}>
                    Question {qi + 1} {q.is_mandatory && <span style={{ color: '#c0392b' }}>*</span>}
                  </div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.3px', textTransform: 'uppercase', color: '#0a0a0a', lineHeight: 1.2 }}>
                    {q.text}
                  </div>
                </div>
                {answers[q._id] && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27ae60', flexShrink: 0, marginTop: '4px' }} />
                )}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {getOptionsForQuestion(q._id).map((opt) => {
                  const isSelected = answers[q._id] === opt._id
                  return (
                    <button
                      key={opt._id}
                      onClick={() => onSelect(q._id, opt._id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '16px 20px', background: isSelected ? '#0a0a0a' : 'transparent',
                        border: `1.5px solid ${isSelected ? '#0a0a0a' : 'rgba(0,0,0,0.12)'}`,
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%'
                      }}
                    >
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${isSelected ? '#f0eeea' : 'rgba(0,0,0,0.2)'}`,
                        background: isSelected ? '#f0eeea' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0a0a0a' }} />}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: isSelected ? '#f0eeea' : '#0a0a0a', letterSpacing: '0.3px' }}>
                        {opt.text}
                      </span>
                    </button>
                  )
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Submit */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: '#888' }}>
            {Object.keys(answers).length} of {questions.length} answered
          </div>
          <button onClick={onSubmit} className="btn-primary" disabled={submitting} style={{ width: 'auto', padding: '16px 40px' }}>
            {submitting ? 'Submitting...' : 'Submit Response →'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default TakePoll