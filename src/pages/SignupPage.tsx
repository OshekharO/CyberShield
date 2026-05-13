import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { ThemeToggle } from '../components/ThemeToggle'
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
    <div className="mesh-bg min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl justify-end">
        <ThemeToggle />
      </div>
      <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CyberShield onboarding</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight">Create your workspace and start scanning indicators in minutes.</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-base-content/70">
            Launch a newly designed SOC interface built around daisyUI cards, forms, and dashboards.
          </p>
        </div>

        <SurfacePanel scanline className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-box bg-primary/15 text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CyberShield</p>
              <p className="text-sm text-base-content/60">Create account</p>
            </div>
          </div>

          <HUDHeader title="Create account" subtitle="Set up your analyst account to access scans, threat feeds, and reports." />

          <div className="mt-6 space-y-4">
            <label className="form-control w-full gap-2">
              <span className="label-text font-medium">Full name</span>
              <Input placeholder="Alex Morgan" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="form-control w-full gap-2">
              <span className="label-text font-medium">Email</span>
              <Input placeholder="analyst@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="form-control w-full gap-2">
              <span className="label-text font-medium">Password</span>
              <Input type="password" placeholder="Choose a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error ? <div className="alert alert-error text-sm">{error}</div> : null}
            <Button className="w-full" onClick={submit}>
              Create account
            </Button>
          </div>

          <p className="mt-5 text-sm text-base-content/60">
            Have an account?{' '}
            <Link to="/login" className="link link-primary font-semibold">
              Sign in
            </Link>
          </p>
        </SurfacePanel>
      </div>
    </div>
  )
}
