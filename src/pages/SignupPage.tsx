import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AutoGraphRounded from '@mui/icons-material/AutoGraphRounded'
import VerifiedUserRounded from '@mui/icons-material/VerifiedUserRounded'
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
    <Stack component="main" justifyContent="center" sx={{ minHeight: 'calc(100vh - 2rem)', px: { xs: 2.5, sm: 3 }, py: { xs: 4, sm: 6 } }}>
      <Box className="mx-auto grid w-full max-w-5xl gap-5 md:grid-cols-[440px_minmax(0,1fr)]">
        <SurfacePanel scanline className="hero-gradient p-8 sm:p-10">
          <HUDHeader label="CyberShield" title="Create account" subtitle="Start scanning indicators and producing analyst-ready reports." glitch />

          <div className="mt-7 space-y-4">
            <FormControl fullWidth>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            {error && <Alert severity="error">{error}</Alert>}
            <Button className="w-full" onClick={submit}>
              Create account
            </Button>
          </div>

          <Divider sx={{ my: 3 }} />
          <p className="text-sm leading-6 text-[var(--text-2)]">
            Have an account?{' '}
            <Link to="/login" className="font-medium text-sky-500 hover:text-sky-400 dark:text-sky-300 dark:hover:text-sky-200">
              Login
            </Link>
          </p>
        </SurfacePanel>

        <SurfacePanel className="hero-gradient relative hidden p-8 md:block">
          <svg className="pointer-events-none absolute -left-16 -bottom-20 h-60 w-60 opacity-25" viewBox="0 0 200 200" fill="none" aria-hidden="true">
            <path d="M35.7,-59.4C47.1,-54.9,57.7,-47.3,64.2,-36.9C70.6,-26.4,72.9,-13.2,73.2,0.2C73.5,13.7,71.7,27.3,64.8,37.3C57.8,47.2,45.8,53.4,34,61.3C22.2,69.2,11.1,78.8,-1.7,81.7C-14.5,84.6,-29.1,80.7,-41,72.8C-53,64.8,-62.3,52.8,-68.7,39.5C-75.1,26.1,-78.5,13,-76.4,1.2C-74.4,-10.7,-66.9,-21.5,-60.5,-33.5C-54.2,-45.5,-49,-58.6,-39.4,-64.2C-29.9,-69.8,-14.9,-67.9,-1.4,-65.5C12.2,-63.1,24.4,-60.2,35.7,-59.4Z" fill="currentColor" />
          </svg>
          <HUDHeader
            label="Analyst-first onboarding"
            title="Build your SOC cockpit"
            subtitle="Create an account and start end-to-end cyber intelligence workflows with polished reporting."
            glitch
          />
          <div className="mt-8 space-y-4">
            <div className="hud-panel flex items-start gap-3">
              <VerifiedUserRounded color="primary" />
              <div>
                <Typography className="cyber-title text-base">Role-based operations</Typography>
                <Typography className="cyber-subtitle">Access controls for analysts and administrators out of the box.</Typography>
              </div>
            </div>
            <div className="hud-panel flex items-start gap-3">
              <AutoGraphRounded color="primary" />
              <div>
                <Typography className="cyber-title text-base">Insight-driven reporting</Typography>
                <Typography className="cyber-subtitle">Generate risk snapshots and reports with cleaner visual analytics.</Typography>
              </div>
            </div>
          </div>
        </SurfacePanel>
      </Box>
    </Stack>
  )
}
