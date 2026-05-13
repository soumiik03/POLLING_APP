import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function CreatePoll() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    is_anonymous: false,
    expires_at: ''
  })

  const [questions, setQuestions] = useState([{
    id: 1,
    text: '',
    is_mandatory: false,
    order_index: 1,
    options: [
      { id: 1, text: '', order_index: 1 },
      { id: 2, text: '', order_index: 2 }
    ]
  }])

  // Update poll form fields
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  // Update question field
  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  // Add new question
  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      text: '',
      is_mandatory: false,
      order_index: questions.length + 1,
      options: [
        { id: Date.now() + 1, text: '', order_index: 1 },
        { id: Date.now() + 2, text: '', order_index: 2 }
      ]
    }])
  }

  // Remove question
  const removeQuestion = (id) => {
    if (questions.length === 1) return
    setQuestions(questions.filter(q => q.id !== id))
  }

  // Add option to question
  const addOption = (questionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: [...q.options, { id: Date.now(), text: '', order_index: q.options.length + 1 }] }
        : q
    ))
  }

  // Remove option
  const removeOption = (questionId, optionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: q.options.filter(o => o.id !== optionId) }
        : q
    ))
  }

  // Update option text
  const updateOption = (questionId, optionId, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: q.options.map(o => o.id === optionId ? { ...o, text: value } : o) }
        : q
    ))
  }

  // Submit
  const handleSubmit = async () => {
    if (!form.title.trim()) return setError('Poll title is required')
    if (questions.some(q => !q.text.trim())) return setError('All questions need text')
    if (questions.some(q => q.options.some(o => !o.text.trim()))) return setError('All options need text')
    if (questions.some(q => q.options.length < 2)) return setError('Each question needs at least 2 options')

    setLoading(true)
    setError('')

    try {
      await API.post('/polls', {
        ...form,
        questions: questions.map(q => ({
          text: q.text,
          is_mandatory: q.is_mandatory,
          order_index: q.order_index,
          options: q.options.map(o => ({
            text: o.text,
            order_index: o.order_index
          }))
        }))
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return <CreatePollUI
    form={form}
    questions={questions}
    error={error}
    loading={loading}
    onFormChange={handleFormChange}
    onUpdateQuestion={updateQuestion}
    onAddQuestion={addQuestion}
    onRemoveQuestion={removeQuestion}
    onAddOption={addOption}
    onRemoveOption={removeOption}
    onUpdateOption={updateOption}
    onSubmit={handleSubmit}
    onBack={() => navigate('/dashboard')}

    
  />
}
function CreatePollUI({ form, questions, error, loading, onFormChange, onUpdateQuestion, onAddQuestion, onRemoveQuestion, onAddOption, onRemoveOption, onUpdateOption, onSubmit, onBack }) {
  return (
    <div style={{ background: '#f0eeea', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="navbar">
        <a className="nav-logo" href="/">Pollify</a>
        <div className="nav-links">
          <button onClick={onBack} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Back
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '140px 48px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '64px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '40px' }}>
          <div className="label-text" style={{ marginBottom: '12px' }}>New Poll</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 4vw, 56px)', letterSpacing: '-1.5px', textTransform: 'uppercase', lineHeight: 1, color: '#0a0a0a' }}>
            BUILD YOUR<br />POLL.
          </div>
        </div>

        {error && <div className="error-msg" style={{ marginBottom: '32px' }}>{error}</div>}

        {/* Poll Details */}
        <div style={{ marginBottom: '48px' }}>
          <div className="label-text" style={{ marginBottom: '24px' }}>Poll Details</div>

          <div className="field-group">
            <label className="field-label">Poll Title *</label>
            <input className="field-input" type="text" name="title" placeholder="What's your poll about?" value={form.title} onChange={onFormChange} />
          </div>

          <div className="field-group">
            <label className="field-label">Description</label>
            <input className="field-input" type="text" name="description" placeholder="Optional description" value={form.description} onChange={onFormChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '8px' }}>
            <div className="field-group">
              <label className="field-label">Expiry Date</label>
              <input className="field-input" type="datetime-local" name="expires_at" value={form.expires_at} onChange={onFormChange} />
            </div>
            <div className="field-group" style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '24px' }}>
              <input type="checkbox" name="is_anonymous" id="anon" checked={form.is_anonymous} onChange={onFormChange} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0a0a0a' }} />
              <label htmlFor="anon" style={{ fontSize: '13px', color: '#0a0a0a', cursor: 'pointer', fontWeight: 500 }}>Allow anonymous responses</label>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div className="label-text">Questions ({questions.length})</div>
          </div>

          {questions.map((q, qi) => (
            <div key={q.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '32px', marginBottom: '2px' }}>

              {/* Question header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: '#0a0a0a' }}>
                  Question {qi + 1}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#888', cursor: 'pointer' }}>
                    <input type="checkbox" checked={q.is_mandatory} onChange={(e) => onUpdateQuestion(q.id, 'is_mandatory', e.target.checked)} style={{ accentColor: '#0a0a0a' }} />
                    Mandatory
                  </label>
                  {questions.length > 1 && (
                    <button onClick={() => onRemoveQuestion(q.id)} style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '16px', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                  )}
                </div>
              </div>

              {/* Question text */}
              <input
                className="field-input"
                type="text"
                placeholder="Ask your question..."
                value={q.text}
                onChange={(e) => onUpdateQuestion(q.id, 'text', e.target.value)}
                style={{ marginBottom: '24px', borderBottomColor: 'rgba(0,0,0,0.15)' }}
              />

              {/* Options */}
              <div style={{ marginLeft: '16px' }}>
                <div className="label-text" style={{ marginBottom: '12px' }}>Options</div>
                {q.options.map((opt, oi) => (
                  <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(0,0,0,0.15)', borderRadius: '50%', flexShrink: 0 }} />
                    <input
                      className="field-input"
                      type="text"
                      placeholder={`Option ${oi + 1}`}
                      value={opt.text}
                      onChange={(e) => onUpdateOption(q.id, opt.id, e.target.value)}
                      style={{ borderBottomColor: 'rgba(0,0,0,0.1)', padding: '8px 0' }}
                    />
                    {q.options.length > 2 && (
                      <button onClick={() => onRemoveOption(q.id, opt.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>✕</button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => onAddOption(q.id)}
                  style={{ marginTop: '8px', background: 'none', border: 'none', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', cursor: 'pointer', fontWeight: 600, padding: '8px 0' }}
                >
                  + Add Option
                </button>
              </div>

            </div>
          ))}

          <button
            onClick={onAddQuestion}
            style={{ width: '100%', padding: '20px', background: 'transparent', border: '1.5px dashed rgba(0,0,0,0.2)', color: '#888', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', marginTop: '2px', transition: 'all 0.2s' }}
          >
            + Add Question
          </button>
        </div>

        {/* Submit */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onSubmit} className="btn-primary" disabled={loading} style={{ width: 'auto', padding: '18px 48px' }}>
            {loading ? 'Creating...' : 'Publish Poll →'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CreatePoll
