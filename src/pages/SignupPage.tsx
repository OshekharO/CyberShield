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
        <SurfacePanel className="auth-card">
          <HUDHeader label="CyberShield" title="Create Account" subtitle="Set up your analyst credentials to begin threat operations." />

          <div className="stack-4" style={{ marginTop: '1.5rem' }}>
            <label className="form-field" htmlFor="name">
              <span className="form-label">Full name</span>
              <Input id="name" placeholder="Alex Morgan" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="form-field" htmlFor="email">
              <span className="form-label">Work email</span>
              <Input id="email" placeholder="alex@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="form-field" htmlFor="password">
              <span className="form-label">Password</span>
              <Input id="password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <p className="form-error">{error}</p>}
            <Button className="w-full" onClick={submit}>
              Create Account
            </Button>
          </div>

          <p className="auth-actions">
            Already have an account?{' '}
            <Link to="/login" className="cyber-link">
              Sign In
            </Link>
          </p>
        </SurfacePanel>

        <aside className="auth-side">
          <HUDHeader
            label="Analyst-First Onboarding"
            title="Accelerate Threat Defense"
            subtitle="Equip your security team with multi-provider IOC enrichment, automated risk scoring, and exportable audit reports."
          />
          <div className="stack-4" style={{ marginTop: '2rem' }}>
            <div className="hud-panel row-between" style={{ justifyContent: 'flex-start' }}>
              <BadgeCheck size={18} className="icon-muted" />
              <div>
                <h3 className="cyber-title" style={{ fontSize: '0.95rem' }}>
                  Strict Governance
                </h3>
                <p className="cyber-subtitle" style={{ fontSize: '0.85rem' }}>
                  Role-based permission barriers to safeguard incident records and provider secrets.
                </p>
              </div>
            </div>
            <div className="hud-panel row-between" style={{ justifyContent: 'flex-start' }}>
              <ChartNoAxesCombined size={18} className="icon-muted" />
              <div>
                <h3 className="cyber-title" style={{ fontSize: '0.95rem' }}>
                  AI Threat Summaries
                </h3>
                <p className="cyber-subtitle" style={{ fontSize: '0.85rem' }}>
                  Actionable mitigation playbooks generated instantly for high-risk detections.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
