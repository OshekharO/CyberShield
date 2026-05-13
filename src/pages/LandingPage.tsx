import { Link } from 'react-router-dom'
import { ArrowRight, Radar, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Button } from '../components/ui/button'
import { GlitchText } from '../components/ui/glitch-text'
import { SurfacePanel } from '../components/ui/surface-panel'
import { ThemeToggle } from '../components/ThemeToggle'

const features = [
  {
    icon: ShieldCheck,
    title: 'Unified scanning',
    desc: 'Run URL, email, domain, and IP scans from a single analyst workspace.',
  },
  {
    icon: Radar,
    title: 'Risk-first triage',
    desc: 'See hot indicators, severity bands, and high-priority actions immediately.',
  },
  {
    icon: Workflow,
    title: 'Report ready',
    desc: 'Move from intake to exportable reports without switching tools or tabs.',
  },
]

const stats = [
  { label: 'Analyst workspaces', value: '24/7' },
  { label: 'Signal channels', value: '4 IOC types' },
  { label: 'Export flow', value: '1-click PDFs' },
]

export default function LandingPage() {
  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="navbar rounded-box card-border bg-base-100/85 px-4 shadow-sm backdrop-blur">
          <div className="flex-1 gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-box bg-primary/15 text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CyberShield</p>
              <p className="text-sm text-base-content/60">Modern SOC workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">
              Sign in
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Get started
            </Link>
          </div>
        </div>

        <section className="grid gap-6 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
          <div className="space-y-6">
            <div className="badge badge-primary badge-outline gap-2 border-primary/40 bg-primary/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em]">
              <Sparkles size={14} />
              Designed from the ground up with daisyUI
            </div>
            <div className="space-y-4">
              <GlitchText as="h1" text="CyberShield" className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl" />
              <p className="max-w-2xl text-lg leading-8 text-base-content/70">
                A fresh cyber operations website focused on clean navigation, fast scans, and analyst-friendly reporting.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg">
                  Launch workspace <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Explore dashboard
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-box border border-base-300/60 bg-base-100/80 p-4 shadow-sm">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-sm text-base-content/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <SurfacePanel scanline className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mission control</p>
              <h2 className="text-3xl font-semibold">One interface for scan, triage, and export.</h2>
              <p className="text-sm leading-7 text-base-content/70">
                Give defenders a streamlined environment with structured scan inputs, risk summaries, and PDF-ready outputs.
              </p>
            </div>
            <div className="stats stats-vertical border border-base-300/60 bg-base-200/60 shadow-sm lg:stats-vertical">
              <div className="stat">
                <div className="stat-title">Active focus</div>
                <div className="stat-value text-primary">Threat review</div>
                <div className="stat-desc">Monitor and sort inbound IOC findings</div>
              </div>
              <div className="stat">
                <div className="stat-title">Team benefit</div>
                <div className="stat-value text-secondary">Faster handoff</div>
                <div className="stat-desc">Share report-ready data with less friction</div>
              </div>
            </div>
          </SurfacePanel>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <SurfacePanel key={feature.title} className="space-y-4 p-6 transition-transform duration-200 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-box bg-primary/15 text-primary">
                <feature.icon size={22} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-base-content/65">{feature.desc}</p>
              </div>
            </SurfacePanel>
          ))}
        </section>
      </div>
    </div>
  )
}
