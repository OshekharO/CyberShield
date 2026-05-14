import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { authService } from '../services/authService'
import { getApiErrorMessage } from '../utils/apiError'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [resetUrl, setResetUrl] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = async () => {
    setError('')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    try {
      const data = await authService.forgotPassword(email)
      setSubmitted(true)
      if (data.resetUrl) {
        setResetUrl(data.resetUrl)
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Something went wrong. Please try again.'))
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-grid">
        <SurfacePanel scanline className="hero-gradient auth-card">
          <HUDHeader label="CyberShield" title="Reset password" subtitle="Enter your email address and we will send you a reset link." glitch />

          {submitted ? (
            <div className="stack-4" style={{ marginTop: '1.6rem' }}>
              <p className="cyber-subtitle">
                If an account exists for <strong>{email}</strong>, a reset link has been generated.
              </p>
              {resetUrl && (
                <div className="hud-panel" style={{ wordBreak: 'break-all' }}>
                  <p className="form-label" style={{ marginBottom: '0.4rem' }}>Reset link</p>
                  <Link to={resetUrl.replace(window.location.origin, '')} className="cyber-link" style={{ fontSize: '0.8rem' }}>
                    {resetUrl}
                  </Link>
                </div>
              )}
              <p className="auth-actions">
                <Link to="/login" className="cyber-link">
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <div className="stack-4" style={{ marginTop: '1.6rem' }}>
              <label className="form-field" htmlFor="email">
                <span className="form-label">Email</span>
                <Input
                  id="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <Button className="w-full" onClick={submit}>
                Send reset link
              </Button>
              <p className="auth-actions">
                <Link to="/login" className="cyber-link">
                  Back to sign in
                </Link>
              </p>
            </div>
          )}
        </SurfacePanel>
      </div>
    </main>
  )
}
