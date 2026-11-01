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
      <div className="auth-grid" style={{ maxWidth: '30rem' }}>
        <SurfacePanel className="auth-card">
          <HUDHeader label="CyberShield" title="Reset Password" subtitle="Enter your work email address to generate an access recovery link." />

          {submitted ? (
            <div className="stack-4" style={{ marginTop: '1.5rem' }}>
              <p className="cyber-subtitle">
                If an account exists for <strong>{email}</strong>, a reset link has been generated.
              </p>
              {resetUrl && (
                <div className="hud-panel" style={{ wordBreak: 'break-all' }}>
                  <p className="form-label" style={{ marginBottom: '0.4rem' }}>Direct Recovery Link</p>
                  <Link to={resetUrl.replace(window.location.origin, '')} className="cyber-link" style={{ fontSize: '0.8125rem' }}>
                    {resetUrl}
                  </Link>
                </div>
              )}
              <p className="auth-actions">
                <Link to="/login" className="cyber-link">
                  Return to Sign In
                </Link>
              </p>
            </div>
          ) : (
            <div className="stack-4" style={{ marginTop: '1.5rem' }}>
              <label className="form-field" htmlFor="email">
                <span className="form-label">Work email</span>
                <Input
                  id="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <Button className="w-full" onClick={submit}>
                Send Recovery Link
              </Button>
              <p className="auth-actions">
                <Link to="/login" className="cyber-link">
                  Return to Sign In
                </Link>
              </p>
            </div>
          )}
        </SurfacePanel>
      </div>
    </main>
  )
}
