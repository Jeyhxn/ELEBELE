import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { verifyEmail } from '../api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided.')
      return
    }

    verifyEmail(token)
      .then(res => {
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully!')
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.')
      })
  }, [searchParams])

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === 'verifying' && (
          <>
            <h1>Verifying...</h1>
            <p className="auth-subtitle">Please wait while we verify your email.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h1>Email Verified!</h1>
            <p className="auth-subtitle">{message}</p>
            <Link to="/login" className="auth-button" style={{ display: 'inline-block', marginTop: '16px', textDecoration: 'none', textAlign: 'center' }}>
              Sign In
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1>Verification Failed</h1>
            <p className="auth-subtitle">{message}</p>
            <div className="auth-footer">
              <p><Link to="/register">Back to Sign Up</Link></p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
