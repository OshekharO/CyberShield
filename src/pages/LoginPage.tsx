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
    <div className="mesh-bg min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl justify-end">
        <ThemeToggle />
      </div>
      <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CyberShield access</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight">Sign in to manage threats with a cleaner security workspace.</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-base-content/70">
            Review scans, follow risk signals, and generate reports from a redesigned daisyUI experience.
          </p>
        </div>

        <SurfacePanel scanline className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-box bg-primary/15 text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CyberShield</p>
              <p className="text-sm text-base-content/60">Secure login</p>
            </div>
          </div>

          <HUDHeader title="Welcome back" subtitle="Enter your account details to open the operations workspace." />

          <div className="mt-6 space-y-4">
            <label className="form-control w-full gap-2">
              <span className="label-text font-medium">Email</span>
              <Input placeholder="analyst@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="form-control w-full gap-2">
              <span className="label-text font-medium">Password</span>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error ? <div className="alert alert-error text-sm">{error}</div> : null}
            <Button className="w-full" onClick={submit}>
              Sign in
            </Button>
          </div>

          <p className="mt-5 text-sm text-base-content/60">
            No account?{' '}
            <Link to="/signup" className="link link-primary font-semibold">
              Create one
            </Link>
          </p>
        </SurfacePanel>
      </div>
    </div>
  )
}
