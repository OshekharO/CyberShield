import { useState } from 'react'
import { Shield, Compass } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { useAuthStore } from '../store/authStore'
import { getApiErrorMessage } from '../utils/apiError'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (error) {
      setError(getApiErrorMessage(error, 'Login failed. Please check your credentials and try again.'))
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-grid">
        <SurfacePanel className="hero-gradient auth-side">
          <HUDHeader
            label="Security operations platform"
            title="Intelligence-ready operations"
            subtitle="Triage indicators, monitor threat posture, and generate analyst reports from one control center."
            glitch
          />
          <div className="stack-4" style={{ marginTop: '1.8rem' }}>
            <div className="hud-panel row-between" style={{ justifyContent: 'flex-start' }}>
              <Shield size={18} className="icon-muted" />
              <div>
                <h3 className="cyber-title" style={{ fontSize: '1rem' }}>
                  Zero-friction access
                </h3>
                <p className="cyber-subtitle">Secure login, role-aware workspace, and session-safe controls.</p>
              </div>
            </div>
            <div className="hud-panel row-between" style={{ justifyContent: 'flex-start' }}>
              <Compass size={18} className="icon-muted" />
              <div>
                <h3 className="cyber-title" style={{ fontSize: '1rem' }}>
                  Fast SOC workflow
                </h3>
                <p className="cyber-subtitle">Run scans and move directly into triage and downloadable reports.</p>
              </div>
            </div>
          </div>
        </SurfacePanel>

        <SurfacePanel scanline className="hero-gradient auth-card">
          <HUDHeader label="CyberShield" title="Welcome back" subtitle="Sign in to access your security operations dashboard." glitch />

          <div className="stack-4" style={{ marginTop: '1.6rem' }}>
            <label className="form-field" htmlFor="email">
              <span className="form-label">Email</span>
              <Input id="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="form-field" htmlFor="password">
              <span className="form-label">Password</span>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <p className="form-error">{error}</p>}
            <Button className="w-full" onClick={submit}>
              Sign in
            </Button>
          </div>

          <p className="auth-actions">
            <Link to="/forgot-password" className="cyber-link">
              Forgot password?
            </Link>
          </p>

          <p className="auth-actions">
            No account?{' '}
            <Link to="/signup" className="cyber-link">
              Create one
            </Link>
          </p>
        </SurfacePanel>
      </div>
    </main>
  )
}
