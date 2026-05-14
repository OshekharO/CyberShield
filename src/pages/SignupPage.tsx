import { useState } from 'react'
import { BadgeCheck, ChartNoAxesCombined } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { useAuthStore } from '../store/authStore'
import { getApiErrorMessage } from '../utils/apiError'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    try {
      await signup({ email, password, name })
      navigate('/dashboard')
    } catch (error) {
      setError(getApiErrorMessage(error, 'Account creation failed. Please verify database setup and try again.'))
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-grid auth-grid-reverse">
        <SurfacePanel scanline className="hero-gradient auth-card">
          <HUDHeader label="CyberShield" title="Create account" subtitle="Start scanning indicators and producing analyst-ready reports." glitch />

          <div className="stack-4" style={{ marginTop: '1.6rem' }}>
            <label className="form-field" htmlFor="name">
              <span className="form-label">Full name</span>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="form-field" htmlFor="email">
              <span className="form-label">Email</span>
              <Input id="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="form-field" htmlFor="password">
              <span className="form-label">Password</span>
              <Input id="password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <p className="form-error">{error}</p>}
            <Button className="w-full" onClick={submit}>
              Create account
            </Button>
          </div>

          <p className="auth-actions">
            Have an account?{' '}
            <Link to="/login" className="cyber-link">
              Login
            </Link>
          </p>
        </SurfacePanel>

        <SurfacePanel className="hero-gradient auth-side">
          <HUDHeader
            label="Analyst-first onboarding"
            title="Build your SOC cockpit"
            subtitle="Create an account and start end-to-end cyber intelligence workflows with polished reporting."
            glitch
          />
          <div className="stack-4" style={{ marginTop: '1.8rem' }}>
            <div className="hud-panel row-between" style={{ justifyContent: 'flex-start' }}>
              <BadgeCheck size={18} className="icon-muted" />
              <div>
                <h3 className="cyber-title" style={{ fontSize: '1rem' }}>
                  Role-based operations
                </h3>
                <p className="cyber-subtitle">Access controls for analysts and administrators out of the box.</p>
              </div>
            </div>
            <div className="hud-panel row-between" style={{ justifyContent: 'flex-start' }}>
              <ChartNoAxesCombined size={18} className="icon-muted" />
              <div>
                <h3 className="cyber-title" style={{ fontSize: '1rem' }}>
                  Insight-driven reporting
                </h3>
                <p className="cyber-subtitle">Generate risk snapshots and reports with cleaner visual analytics.</p>
              </div>
            </div>
          </div>
        </SurfacePanel>
      </div>
    </main>
  )
}
