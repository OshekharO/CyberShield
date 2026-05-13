import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
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
    <div className="relative mx-auto mt-10 max-w-md px-4 text-slate-100 sm:mt-16">
      <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-violet-500/25 blur-2xl" />
      <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-8 shadow-2xl backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">CyberShield</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-300">Sign in to continue monitoring your threat intelligence pipeline.</p>

        <div className="mt-6 space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
          <Button className="w-full" onClick={submit}>
            Sign in
          </Button>
        </div>

        <p className="mt-5 text-sm text-slate-400">
          No account?{' '}
          <Link to="/signup" className="font-medium text-cyan-300 hover:text-cyan-200">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
