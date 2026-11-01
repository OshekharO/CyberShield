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
        <aside className="auth-side">
          <HUDHeader
            label="Enterprise SecOps"
            title="Threat Intelligence Command"
            subtitle="Automated IOC triage, comprehensive provider signals, and analyst reporting in one workspace."
          />
          <div className="stack-4" style={{ marginTop: '2rem' }}>
            <div className="hud-panel row-between" style={{ justifyContent: 'flex-start' }}>
              <Shield size={18} className="icon-muted" />
              <div>
                <h3 className="cyber-title" style={{ fontSize: '0.95rem' }}>
                  Role-Based Security
                </h3>
                <p className="cyber-subtitle" style={{ fontSize: '0.85rem' }}>
                  JWT-authenticated sessions with HTTP-only cookies and granular analyst RBAC.
                </p>
              </div>
            </div>
            <div className="hud-panel row-between" style={{ justifyContent: 'flex-start' }}>
              <Compass size={18} className="icon-muted" />
              <div>
                <h3 className="cyber-title" style={{ fontSize: '0.95rem' }}>
                  Automated Triage Pipeline
                </h3>
                <p className="cyber-subtitle" style={{ fontSize: '0.85rem' }}>
                  Aggregate threat signals across IPs, domains, hashes, and URLs with sub-second lookups.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <SurfacePanel className="auth-card">
          <HUDHeader label="CyberShield" title="Sign In" subtitle="Enter your credentials to access your security workspace." />

          <div className="stack-4" style={{ marginTop: '1.5rem' }}>
            <label className="form-field" htmlFor="email">
              <span className="form-label">Work email</span>
              <Input id="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="form-field" htmlFor="password">
              <span className="form-label">Password</span>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <p className="form-error">{error}</p>}
            <Button className="w-full" onClick={submit}>
              Sign In
            </Button>
          </div>

          <div className="auth-actions">
            <Link to="/forgot-password" className="cyber-link">
              Forgot password?
            </Link>
          </div>

          <p className="auth-actions" style={{ borderTop: 'none', paddingTop: 0, marginTop: '0.75rem' }}>
            Need an account?{' '}
            <Link to="/signup" className="cyber-link">
              Create an account
            </Link>
          </p>
        </SurfacePanel>
      </div>
    </main>
  )
}
