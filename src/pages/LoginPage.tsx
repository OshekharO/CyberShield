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
    <div className="mx-auto mt-8 max-w-md px-4 sm:mt-16">
      <SurfacePanel scanline className="p-8">
        <HUDHeader
          label="CyberShield"
          title="Welcome back"
          subtitle="Sign in to access your security operations dashboard."
          glitch
        />

        <div className="mt-6 space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && (
            <p className="border border-rose-300/45 bg-rose-500/12 px-3 py-2 text-sm text-rose-200 [clip-path:polygon(0.55rem_0,calc(100%-0.55rem)_0,100%_0.55rem,100%_calc(100%-0.55rem),calc(100%-0.55rem)_100%,0.55rem_100%,0_calc(100%-0.55rem),0_0.55rem)]">
              {error}
            </p>
          )}
          <Button className="w-full" onClick={submit}>
            Sign in
          </Button>
        </div>

        <p className="mt-5 text-sm text-[var(--text-2)]">
          No account?{' '}
          <Link to="/signup" className="font-medium text-cyan-200 hover:text-cyan-100">
            Create one
          </Link>
        </p>
      </SurfacePanel>
    </div>
  )
}
