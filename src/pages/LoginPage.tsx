import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuthStore } from '../store/authStore'

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
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 text-slate-100">
      <h1 className="text-2xl font-semibold text-cyan-300">Login</h1>
      <div className="mt-4 space-y-3">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <Button className="w-full" onClick={submit}>
          Sign in
        </Button>
      </div>
      <p className="mt-4 text-sm text-slate-400">
        No account? <Link to="/signup" className="text-cyan-300">Create one</Link>
      </p>
    </div>
  )
}
