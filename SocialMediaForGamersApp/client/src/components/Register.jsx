import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, resendVerification } from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Username, email, and password are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      })

      if (response.data.success) {
        setRegistered(true)
      } else {
        setError(response.data.message || 'Registration failed')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResendMsg('')
    try {
      const res = await resendVerification(formData.email)
      setResendMsg(res.data.message || 'Verification email resent!')
    } catch {
      setResendMsg('Failed to resend. Please try again.')
    } finally {
      setResending(false)
    }
  }

  if (registered) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Check Your Email</h1>
          <p className="auth-subtitle">
            We've sent a verification link to <strong>{formData.email}</strong>. 
            Please click the link in the email to verify your account.
          </p>
          <p className="auth-subtitle" style={{ fontSize: '0.9rem', color: '#888', marginTop: '8px' }}>
            The link expires in 24 hours.
          </p>
          {resendMsg && <div className="error" style={{ color: '#6c5ce7' }}>{resendMsg}</div>}
          <button
            className="auth-button"
            style={{ marginTop: '16px' }}
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Resending...' : 'Resend Verification Email'}
          </button>
          <div className="auth-footer">
            <p>Already verified? <a href="/login">Sign In</a></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <p className="auth-subtitle">Create your account</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  )
}
