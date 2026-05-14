import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import SecurityRounded from '@mui/icons-material/SecurityRounded'
import InsightsRounded from '@mui/icons-material/InsightsRounded'
import HubRounded from '@mui/icons-material/HubRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded'
import { Button } from '../components/ui/button'
import { GlitchText } from '../components/ui/glitch-text'
import { SurfacePanel } from '../components/ui/surface-panel'

const features = [
  {
    icon: SecurityRounded,
    title: 'Threat Intelligence',
    desc: 'Scan URL, email, IP, and domain indicators in one workspace.',
  },
  {
    icon: InsightsRounded,
    title: 'Analyst Insights',
    desc: 'Convert scan outcomes into clear AI-assisted incident summaries.',
  },
  {
    icon: HubRounded,
    title: 'Operational Ready',
    desc: 'Built for modern teams with secure auth and role-based access.',
  },
]

export default function LandingPage() {
  return (
    <Box className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <SurfacePanel scanline className="hero-gradient relative overflow-hidden p-8 sm:p-12">
        <svg className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 opacity-30" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <path d="M35.7,-59.4C47.1,-54.9,57.7,-47.3,64.2,-36.9C70.6,-26.4,72.9,-13.2,73.2,0.2C73.5,13.7,71.7,27.3,64.8,37.3C57.8,47.2,45.8,53.4,34,61.3C22.2,69.2,11.1,78.8,-1.7,81.7C-14.5,84.6,-29.1,80.7,-41,72.8C-53,64.8,-62.3,52.8,-68.7,39.5C-75.1,26.1,-78.5,13,-76.4,1.2C-74.4,-10.7,-66.9,-21.5,-60.5,-33.5C-54.2,-45.5,-49,-58.6,-39.4,-64.2C-29.9,-69.8,-14.9,-67.9,-1.4,-65.5C12.2,-63.1,24.4,-60.2,35.7,-59.4Z" fill="currentColor" />
        </svg>

        <Chip
          icon={<AutoAwesomeRounded sx={{ fontSize: 16 }} />}
          label="Security operations platform"
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

        <GlitchText as="h1" text="CyberShield X" className="cyber-title relative mt-5 text-4xl leading-tight md:text-6xl" />
        <Typography className="cyber-subtitle relative mt-4 max-w-2xl md:text-lg">
          Immersive cyber intelligence workflow for monitoring, triage, and reporting across your full IOC pipeline.
        </Typography>

        <Stack direction="row" spacing={1.5} className="relative mt-8 flex-wrap">
          <Link to="/signup">
            <Button className="cyber-glow-cyan" endIcon={<ArrowForwardRounded fontSize="small" />}>
              Start free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Sign in</Button>
          </Link>
        </Stack>
      </SurfacePanel>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {features.map((feature, index) => (
          <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.35 }}>
              <SurfacePanel className="h-full p-5">
                <feature.icon color="primary" />
                <Typography className="cyber-title mt-3 text-lg">{feature.title}</Typography>
                <Typography className="cyber-subtitle mt-2">{feature.desc}</Typography>
              </SurfacePanel>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
