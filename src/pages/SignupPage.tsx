import { useState } from 'react'
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
    <div className="mx-auto mt-6 max-w-md px-4 sm:mt-14">
      <SurfacePanel scanline className="hero-gradient p-7 sm:p-8">
        <HUDHeader
          label="CyberShield"
          title="Create account"
          subtitle="Start scanning indicators and producing analyst-ready reports."
          glitch
        />

        <div className="mt-6 space-y-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="rounded-xl border border-rose-400/40 bg-rose-500/12 px-3 py-2 text-sm text-rose-300">{error}</p>}
          <Button className="w-full" onClick={submit}>
            Create account
          </Button>
        </div>

        <p className="mt-5 text-sm text-[var(--text-2)]">
          Have an account?{' '}
          <Link to="/login" className="font-medium text-sky-500 hover:text-sky-400 dark:text-sky-300 dark:hover:text-sky-200">
            Login
          </Link>
        </p>
      </SurfacePanel>
    </div>
  )
}
