import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shouldNavigate, setShouldNavigate] = useState(false)
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (user && shouldNavigate) {
      navigate('/dashboard')
      setShouldNavigate(false)
    }
  }, [user, shouldNavigate, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/auth/register', form)
      login(res.data.User, res.data.token)
      setShouldNavigate(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">

      {/* Left Panel */}
      <div className="auth-left">
        <div>
          <span className="auth-left-tag">Pollify — Create & Share</span>
        </div>
        <div>
          <div className="auth-left-heading">
            MAKE<br />
            YOUR<br />
            <span>VOICE</span><br />
            COUNT.
          </div>
        </div>
        <div className="auth-left-bottom">
          Create polls in seconds. Share with anyone. Get real insights from real people.
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="label-text" style={{ marginBottom: '16px' }}>Step 01 — Create Account</div>
        <div className="auth-title">JOIN<br />POLLIFY.</div>
        <div className="auth-subtitle">Fill in your details to get started</div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Username</label>
            <input
              className="field-input"
              type="text"
              name="username"
              placeholder="Your name"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">Email Address</label>
            <input
              className="field-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>

    </div>
  )
}

export default Register