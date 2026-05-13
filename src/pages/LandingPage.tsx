import { Link } from 'react-router-dom'
import { ArrowRight, Bot, CheckCircle2, Radar, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Button } from '../components/ui/button'
import { GlitchText } from '../components/ui/glitch-text'
import { SurfacePanel } from '../components/ui/surface-panel'
import { ThemeToggle } from '../components/ThemeToggle'

const features = [
  {
    icon: ShieldCheck,
    title: 'Unified scanning',
    desc: 'Run URL, email, domain, and IP scans from a single analyst workspace with consistent flows and clearer outputs.',
  },
  {
    icon: Radar,
    title: 'Risk-first triage',
    desc: 'Surface high-priority findings faster with readable severity states, cleaner summaries, and stronger visual hierarchy.',
  },
  {
    icon: Workflow,
    title: 'Operational reporting',
    desc: 'Move from detection to export without leaving the app, so reports stay fast and stakeholder-ready.',
  },
]

const stats = [
  { label: 'Workflow coverage', value: '4 IOC types' },
  { label: 'Report delivery', value: '1-click PDFs' },
  { label: 'Workspace access', value: 'Role-based' },
]

const benefits = [
  'Responsive layouts designed for operators across desktop and tablet screens',
  'Consistent spacing, typography, and CTAs for a polished SaaS experience',
  'Built-in light and dark themes with accessible contrast and clear focus states',
]

const workflow = [
  { title: 'Collect indicators', desc: 'Submit suspicious IPs, URLs, emails, and domains through a guided intake form.' },
  { title: 'Review severity', desc: 'Inspect findings inside a calmer dashboard with digestible status labels and risk summaries.' },
  { title: 'Export evidence', desc: 'Generate PDF reports for investigations, handoffs, and stakeholder communication.' },
]

const chips = ['Threat triage', 'IOC scanning', 'Analyst summaries', 'PDF exports']

export default function LandingPage() {
  return (
    <div className="mesh-bg min-h-screen">
      <header className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="navbar rounded-box card-border glass-panel px-4 shadow-sm backdrop-blur-xl">
          <div className="flex-1 gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-box bg-primary/15 text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CyberShield</p>
              <p className="text-sm text-base-content/60">Cybersecurity SaaS platform</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">
              Sign in
            </Link>
            <Link to="/signup" className="btn btn-primary shadow-[0_0_24px_rgba(0,212,255,0.2)]">
              Start free trial
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-20 px-4 pb-16 sm:px-6 lg:px-8 lg:space-y-24 lg:pb-24">
        <section className="grid gap-8 pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-10">
          <div className="space-y-8">
            <div className="badge badge-primary badge-outline gap-2 border-primary/40 bg-primary/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em]">
              <Sparkles size={14} />
              Ground-up daisyUI SaaS redesign
            </div>
            <div className="space-y-5">
              <GlitchText as="h1" text="CyberShield" className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl" />
              <p className="max-w-2xl text-xl leading-9 text-base-content/70">
                Scan indicators, triage cyber threats, and deliver analyst-ready reports from a responsive, user-friendly security product.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg">
                  Start free trial <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  View product workspace
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className="badge badge-outline badge-lg bg-base-100/65 px-4">
                  {chip}
                </span>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel rounded-box border border-base-300/60 p-5 shadow-sm">
                  <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
                  <p className="mt-2 text-sm leading-6 text-base-content/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <SurfacePanel scanline className="space-y-6 p-6 sm:p-8 lg:p-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mission control</p>
              <h2 className="text-3xl font-semibold leading-tight">A complete product surface for the modern security team.</h2>
              <p className="text-sm leading-7 text-base-content/70">
                Inspired by sharper cyber UI references, the interface leans into focused dark mode, brighter accents, and cleaner operator panels.
              </p>
            </div>
            <div className="stats stats-vertical border border-base-300/60 bg-base-200/60 shadow-sm">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Bot size={22} />
                </div>
                <div className="stat-title">Analyst assistance</div>
                <div className="stat-value text-primary">AI-ready</div>
                <div className="stat-desc">Summaries keep investigations readable and shareable</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-accent">
                  <CheckCircle2 size={22} />
                </div>
                <div className="stat-title">Product experience</div>
                <div className="stat-value text-secondary">Responsive</div>
                <div className="stat-desc">Layouts scale cleanly across breakpoints and themes</div>
              </div>
            </div>
          </SurfacePanel>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why CyberShield</p>
              <h2 className="text-3xl font-semibold">Product polish that matches the security workflow.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-base-content/65">
              The redesign uses structured cards, clearer content blocks, better rhythm, and a stronger cyber palette so the site reads like a complete security SaaS product.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <SurfacePanel key={feature.title} className="space-y-4 p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-primary/35">
                <div className="flex h-12 w-12 items-center justify-center rounded-box bg-primary/15 text-primary">
                  <feature.icon size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-base-content/65">{feature.desc}</p>
                </div>
              </SurfacePanel>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SurfacePanel className="space-y-5 p-6 lg:p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Experience goals</p>
              <h2 className="text-3xl font-semibold">Built with the basics of great SaaS UX in mind.</h2>
            </div>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-7 text-base-content/70">
                  <CheckCircle2 className="mt-1 shrink-0 text-success" size={18} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </SurfacePanel>

          <SurfacePanel className="space-y-5 p-6 lg:p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Workflow</p>
              <h2 className="text-3xl font-semibold">How teams move through the product.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {workflow.map((step, index) => (
                <div key={step.title} className="rounded-box border border-base-300/60 bg-base-200/50 p-5">
                  <div className="badge badge-outline mb-4">0{index + 1}</div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-base-content/65">{step.desc}</p>
                </div>
              ))}
            </div>
          </SurfacePanel>
        </section>

        <section className="rounded-box card-border glass-panel px-6 py-10 shadow-sm sm:px-10 lg:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Ready to launch</p>
              <h2 className="text-3xl font-semibold">Start with a polished cyber operations SaaS experience.</h2>
              <p className="max-w-2xl text-sm leading-7 text-base-content/70">
                Create an account, run scans, and manage reporting from a cleaner interface with better spacing, hierarchy, and conversion points.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg">Create account</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
