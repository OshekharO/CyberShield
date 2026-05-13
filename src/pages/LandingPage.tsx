import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Radar, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Button } from '../components/ui/button'
import { GlitchText } from '../components/ui/glitch-text'
import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'

const features = [
  { icon: ShieldCheck, title: 'Threat Intelligence', desc: 'Scan URL, email, IP, and domain indicators in one workspace.' },
  { icon: Radar, title: 'Analyst Insights', desc: 'Convert scan outcomes into clear AI-assisted incident summaries.' },
  { icon: Workflow, title: 'Operational Ready', desc: 'Built for modern teams with secure auth and role-based access.' },
]

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <SurfacePanel scanline className="hero-gradient relative overflow-hidden p-8 sm:p-12">
        <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-sky-400/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-0 h-72 w-72 rounded-full bg-indigo-500/18 blur-3xl" />

        <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-500/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-[var(--text-1)]">
          <Sparkles size={14} />
          Security operations platform
        </p>

        <GlitchText as="h1" text="CyberShield X" className="cyber-title relative mt-5 text-4xl leading-tight md:text-6xl" />
        <p className="relative mt-4 max-w-2xl cyber-subtitle md:text-lg">
          Immersive cyber intelligence workflow for monitoring, triage, and reporting across your full IOC pipeline.
        </p>

        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link to="/signup">
            <Button className="cyber-glow-cyan">
              Start free <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Sign in</Button>
          </Link>
        </div>
      </SurfacePanel>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <motion.div key={feature.title} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <SurfacePanel className="h-full p-5">
              <feature.icon className="text-sky-400" />
              <HUDHeader title={feature.title} subtitle={feature.desc} className="mt-3" />
            </SurfacePanel>
          </motion.div>
        ))}
      </section>
    </div>
  )
}
