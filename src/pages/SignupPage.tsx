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
    <div className="mx-auto mt-8 max-w-md px-4 sm:mt-16">
      <SurfacePanel scanline className="p-8">
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
          {error && (
            <p className="border border-rose-300/45 bg-rose-500/12 px-3 py-2 text-sm text-rose-200 [clip-path:polygon(0.55rem_0,calc(100%-0.55rem)_0,100%_0.55rem,100%_calc(100%-0.55rem),calc(100%-0.55rem)_100%,0.55rem_100%,0_calc(100%-0.55rem),0_0.55rem)]">
              {error}
            </p>
          )}
          <Button className="w-full" onClick={submit}>
            Create account
          </Button>
        </div>

        <p className="mt-5 text-sm text-[var(--text-2)]">
          Have an account?{' '}
          <Link to="/login" className="font-medium text-cyan-200 hover:text-cyan-100">
            Login
          </Link>
        </p>
      </SurfacePanel>
    </div>
  )
}
