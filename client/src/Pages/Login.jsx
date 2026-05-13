import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
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
      const res = await API.post('/auth/login', form)
      login(res.data.User, res.data.token)
      setShouldNavigate(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">

      {/* Left Panel */}
      <div className="auth-left">
        <div>
          <span className="auth-left-tag">Pollify — Welcome Back</span>
        </div>
        <div>
          <div className="auth-left-heading">
            YOUR<br />
            POLLS<br />
            <span>AWAIT</span><br />
            YOU.
          </div>
        </div>
        <div className="auth-left-bottom">
          Sign back in to access your polls, view analytics and collect more responses.
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="label-text" style={{ marginBottom: '16px' }}>Step 01 — Sign In</div>
        <div className="auth-title">WELCOME<br />BACK.</div>
        <div className="auth-subtitle">Enter your credentials to continue</div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create one free</Link>
        </div>
      </div>

    </div>
  )
}

export default Login