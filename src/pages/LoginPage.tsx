import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ShieldMoonRounded from '@mui/icons-material/ShieldMoonRounded'
import TravelExploreRounded from '@mui/icons-material/TravelExploreRounded'
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
    <Stack component="main" justifyContent="center" sx={{ minHeight: 'calc(100vh - 2rem)', px: 2, py: { xs: 4, sm: 6 } }}>
      <Box className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-[minmax(0,1fr)_420px]">
        <SurfacePanel className="hero-gradient relative hidden p-8 md:block">
          <svg className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 opacity-30" viewBox="0 0 200 200" fill="none" aria-hidden="true">
            <path d="M43.2,-63.1C57.2,-57.7,70.3,-48.4,76,-35.2C81.7,-22,80.2,-4.9,74.7,9.9C69.2,24.7,59.8,37.2,47.6,47.8C35.4,58.4,20.4,67.2,4.2,70.9C-12,74.5,-24,73,-36,67.5C-48.1,62,-60.1,52.4,-67.6,39.8C-75.2,27.2,-78.3,11.6,-76.4,-2.8C-74.6,-17.2,-67.8,-30.4,-58.4,-41.4C-49,-52.4,-37,-61.3,-24,-66C-11,-70.8,3,-71.3,16.8,-67.9C30.6,-64.5,44.2,-57.1,43.2,-63.1Z" fill="currentColor" />
          </svg>
          <HUDHeader
            label="Security operations platform"
            title="Intelligence-ready operations"
            subtitle="Triage indicators, monitor threat posture, and generate analyst reports from one control center."
            glitch
          />
          <div className="mt-8 space-y-4">
            <div className="hud-panel flex items-start gap-3">
              <ShieldMoonRounded color="primary" />
              <div>
                <Typography className="cyber-title text-base">Zero-friction access</Typography>
                <Typography className="cyber-subtitle">Secure login, role-aware workspace, and session-safe controls.</Typography>
              </div>
            </div>
            <div className="hud-panel flex items-start gap-3">
              <TravelExploreRounded color="primary" />
              <div>
                <Typography className="cyber-title text-base">Fast SOC workflow</Typography>
                <Typography className="cyber-subtitle">Run scans and move directly into triage and downloadable reports.</Typography>
              </div>
            </div>
          </div>
        </SurfacePanel>

        <SurfacePanel scanline className="hero-gradient p-7 sm:p-9">
          <HUDHeader label="CyberShield" title="Welcome back" subtitle="Sign in to access your security operations dashboard." glitch />

          <div className="mt-7 space-y-4">
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            {error && <Alert severity="error">{error}</Alert>}
            <Button className="w-full" onClick={submit}>
              Sign in
            </Button>
          </div>

          <Divider sx={{ my: 3 }} />
          <p className="text-sm text-[var(--text-2)]">
            No account?{' '}
            <Link to="/signup" className="font-medium text-sky-500 hover:text-sky-400 dark:text-sky-300 dark:hover:text-sky-200">
              Create one
            </Link>
          </p>
        </SurfacePanel>
      </Box>
    </Stack>
  )
}
