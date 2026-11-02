import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { authService } from '../services/authService'
import { getApiErrorMessage } from '../utils/apiError'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')

    if (!token) {
      setError('Reset token is missing. Please use the link from your reset email.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await authService.resetPassword(token, newPassword)
      navigate('/login')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Password reset failed. The link may have expired.'))
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-grid" style={{ maxWidth: '30rem' }}>
        <SurfacePanel className="auth-card">
          <HUDHeader label="CyberShield" title="Set New Password" subtitle="Choose a strong password to secure your analyst account." />

          <div className="stack-4" style={{ marginTop: '1.5rem' }}>
            <label className="form-field" htmlFor="new-password">
              <span className="form-label">New password</span>
              <Input
                id="new-password"
                type="password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label className="form-field" htmlFor="confirm-password">
              <span className="form-label">Confirm new password</span>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <Button className="w-full" onClick={submit}>
              Save New Password
            </Button>
            <p className="auth-actions">
              <Link to="/login" className="cyber-link">
                Return to Sign In
              </Link>
            </p>
          </div>
        </SurfacePanel>
      </div>
    </main>
  )
}
