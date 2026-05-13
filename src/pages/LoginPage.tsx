import { useState } from 'react'
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
    <div className="mx-auto mt-6 max-w-md px-4 sm:mt-14">
      <SurfacePanel scanline className="hero-gradient p-7 sm:p-8">
        <HUDHeader
          label="CyberShield"
          title="Welcome back"
          subtitle="Sign in to access your security operations dashboard."
          glitch
        />

        <div className="mt-6 space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="rounded-xl border border-rose-400/40 bg-rose-500/12 px-3 py-2 text-sm text-rose-300">{error}</p>}
          <Button className="w-full" onClick={submit}>
            Sign in
          </Button>
        </div>

        <p className="mt-5 text-sm text-[var(--text-2)]">
          No account?{' '}
          <Link to="/signup" className="font-medium text-sky-500 hover:text-sky-400 dark:text-sky-300 dark:hover:text-sky-200">
            Create one
          </Link>
        </p>
      </SurfacePanel>
    </div>
  )
}
