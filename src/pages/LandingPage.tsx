import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import SecurityRounded from '@mui/icons-material/SecurityRounded'
import InsightsRounded from '@mui/icons-material/InsightsRounded'
import HubRounded from '@mui/icons-material/HubRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import { Button } from '../components/ui/button'
import { SurfacePanel } from '../components/ui/surface-panel'

const features = [
  {
    icon: SecurityRounded,
    title: 'Threat Intelligence',
    desc: 'Scan URL, email, IP, and domain indicators in one unified analyst workspace.',
  },
  {
    icon: InsightsRounded,
    title: 'Analyst Insights',
    desc: 'Convert scan outcomes into actionable triage summaries with AI-assisted context.',
  },
  {
    icon: HubRounded,
    title: 'Operational Ready',
    desc: 'Deploy role-based workflows for security teams with production-ready guardrails.',
  },
]

const highlights = ['IOC scan orchestration', 'SOC-ready reports', 'Role-based operations', 'Modern MUI design system']

export default function LandingPage() {
  return (
    <Box
      id="hero"
      sx={{
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'radial-gradient(ellipse 80% 55% at 50% -20%, rgba(56,189,248,0.22), transparent)',
      }}
    >
      <Container sx={{ pt: { xs: 7, sm: 10 }, pb: { xs: 6, sm: 8 }, px: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mx: 'auto', maxWidth: 900 }}>
          <Chip
            icon={<AutoAwesomeRounded sx={{ fontSize: 16 }} />}
            label="Enterprise security operations"
            variant="outlined"
            sx={{
              borderColor: 'rgba(56, 189, 248, 0.38)',
              color: 'text.secondary',
              bgcolor: 'rgba(56, 189, 248, 0.1)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.72rem',
              fontWeight: 600,
            }}
          />

          <Typography className="cyber-title" sx={{ fontSize: 'clamp(2.2rem, 8vw, 4rem)', lineHeight: 1.08 }}>
            CyberShield for modern
            <Typography component="span" sx={{ color: 'primary.main', fontSize: 'inherit', fontWeight: 'inherit' }}>
              {' '}SOC teams
            </Typography>
          </Typography>

          <Typography className="cyber-subtitle" sx={{ maxWidth: 760, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Monitor, scan, triage, and report from a single intelligence-driven command center inspired by MUI’s scalable product templates.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap>
            <Link to="/signup">
              <Button className="cyber-glow-cyan" endIcon={<ArrowForwardRounded fontSize="small" />}>
                Start free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Sign in</Button>
            </Link>
          </Stack>
        </Stack>

        <SurfacePanel scanline className="hero-gradient relative mt-8 overflow-hidden p-6 sm:p-8">
          <svg className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 opacity-25" viewBox="0 0 200 200" fill="none" aria-hidden="true">
            <path d="M35.7,-59.4C47.1,-54.9,57.7,-47.3,64.2,-36.9C70.6,-26.4,72.9,-13.2,73.2,0.2C73.5,13.7,71.7,27.3,64.8,37.3C57.8,47.2,45.8,53.4,34,61.3C22.2,69.2,11.1,78.8,-1.7,81.7C-14.5,84.6,-29.1,80.7,-41,72.8C-53,64.8,-62.3,52.8,-68.7,39.5C-75.1,26.1,-78.5,13,-76.4,1.2C-74.4,-10.7,-66.9,-21.5,-60.5,-33.5C-54.2,-45.5,-49,-58.6,-39.4,-64.2C-29.9,-69.8,-14.9,-67.9,-1.4,-65.5C12.2,-63.1,24.4,-60.2,35.7,-59.4Z" fill="currentColor" />
          </svg>
          <Grid container spacing={2}>
            {highlights.map((item) => (
              <Grid key={item} size={{ xs: 12, sm: 6 }}>
                <div className="hud-panel flex items-center gap-2.5">
                  <CheckCircleRounded color="primary" fontSize="small" />
                  <Typography className="cyber-subtitle">{item}</Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </SurfacePanel>

        <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ mt: 1.5 }}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <SurfacePanel className="h-full p-7 sm:p-8">
                <feature.icon color="primary" />
                <Typography className="cyber-title mt-3 text-lg">{feature.title}</Typography>
                <Typography className="cyber-subtitle mt-2 leading-7">{feature.desc}</Typography>
              </SurfacePanel>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
