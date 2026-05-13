import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuthStore } from '../store/authStore'

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
    } catch {
      setError('Signup failed')
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 text-slate-100">
      <h1 className="text-2xl font-semibold text-cyan-300">Sign Up</h1>
      <div className="mt-4 space-y-3">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <Button className="w-full" onClick={submit}>
          Create Account
        </Button>
      </div>
      <p className="mt-4 text-sm text-slate-400">
        Have an account? <Link to="/login" className="text-cyan-300">Login</Link>
      </p>
    </div>
  )
}
