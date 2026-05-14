import { Link } from 'react-router-dom'
import { ArrowRight, Shield, ChartNoAxesCombined, Network, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { SurfacePanel } from '../components/ui/surface-panel'

const features = [
  {
    icon: Shield,
    title: 'Threat Intelligence',
    desc: 'Scan URL, email, IP, and domain indicators in one unified analyst workspace.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Analyst Insights',
    desc: 'Convert scan outcomes into actionable triage summaries with AI-assisted context.',
  },
  {
    icon: Network,
    title: 'Operational Ready',
    desc: 'Deploy role-based workflows for security teams with production-ready guardrails.',
  },
]

const highlights = ['IOC scan orchestration', 'SOC-ready reports', 'Role-based operations', 'Custom CSS SOC design']

export default function LandingPage() {
  return (
    <div className="landing-shell" id="hero">
      <div className="landing-container">
        <section className="hero">
          <p className="status-chip status-low" style={{ margin: '0 auto' }}>
            <Sparkles size={12} />
            Enterprise security operations
          </p>

          <h1 className="cyber-title hero-title">
            CyberShield for modern <span>SOC teams</span>
          </h1>

          <p className="cyber-subtitle" style={{ maxWidth: '47rem', margin: '0 auto' }}>
            Monitor, scan, triage, and report from a single intelligence-driven command center with a custom cyber SaaS interface.
          </p>

          <div className="hero-actions">
            <Link to="/signup">
              <Button className="cyber-glow-cyan" endIcon={<ArrowRight size={14} />}>
                Start free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Sign in</Button>
            </Link>
          </div>
        </section>

        <SurfacePanel scanline className="hero-gradient landing-highlights">
          {highlights.map((item) => (
            <div key={item} className="hud-panel highlight-item">
              <CheckCircle2 size={15} className="icon-muted" />
              <p className="cyber-subtitle">{item}</p>
            </div>
          ))}
        </SurfacePanel>

        <section className="feature-grid">
          {features.map((feature) => (
            <SurfacePanel key={feature.title} className="feature-card">
              <feature.icon size={20} className="feature-icon" />
              <h2 className="cyber-title" style={{ fontSize: '1.2rem', marginTop: '0.8rem' }}>
                {feature.title}
              </h2>
              <p className="cyber-subtitle" style={{ marginTop: '0.5rem' }}>
                {feature.desc}
              </p>
            </SurfacePanel>
          ))}
        </section>
      </div>
    </div>
  )
}
