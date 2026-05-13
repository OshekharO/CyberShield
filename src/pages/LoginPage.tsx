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
    <div className="mx-auto mt-8 max-w-md px-4 sm:mt-16">
      <div className="rounded-3xl border border-slate-300/70 bg-white/95 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">CyberShield</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sign in to access your security operations dashboard.</p>

        <div className="mt-6 space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
          <Button className="w-full" onClick={submit}>
            Sign in
          </Button>
        </div>

        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          No account?{' '}
          <Link to="/signup" className="font-medium text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
