import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Shield,
  ChartNoAxesCombined,
  Network,
  Sparkles,
  CheckCircle2,
  Activity,
  Headset,
  Gauge,
  Mail,
  Phone,
  Building2,
} from 'lucide-react'
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

const detailCards = [
  {
    icon: Activity,
    title: 'Unified command view',
    desc: 'Live scan telemetry, recent activity, and threat posture in one operational canvas.',
  },
  {
    icon: Gauge,
    title: 'Risk-first prioritization',
    desc: 'Score-driven workflows help analysts move from detection to triage faster.',
  },
  {
    icon: Headset,
    title: 'Analyst workflow support',
    desc: 'Built for SOC teams who need fast context, repeatable checks, and clean reporting.',
  },
]

const testimonials = [
  {
    quote:
      'CyberShield made IOC triage dramatically faster for our team. We now move from scan to report in minutes instead of hours.',
    name: 'Riya Sharma',
    role: 'SOC Lead, SentinelOps',
  },
  {
    quote: 'The dashboard gives us exactly what we need at a glance, even during incident peaks and high alert windows.',
    name: 'David Kim',
    role: 'Threat Analyst, BlueGrid',
  },
  {
    quote: 'Simple, clean, and operationally useful. The workflows feel purpose-built for security operations centers.',
    name: 'Noah Patel',
    role: 'Security Manager, ArcWave',
  },
]

const faqItems = [
  {
    question: 'What indicators can we scan with CyberShield?',
    answer: 'You can scan IPs, URLs, domains, and email indicators from a single scan center workflow.',
  },
  {
    question: 'Is CyberShield suitable for small and large SOC teams?',
    answer: 'Yes. The layout and workflows scale from compact teams to larger operations with role-based controls.',
  },
  {
    question: 'Can we export analyst-ready reports?',
    answer: 'Yes. Scan records can be exported to PDF reports for operational reviews and stakeholder sharing.',
  },
  {
    question: 'Does the interface support responsive screens and browser zoom?',
    answer: 'Yes. The UI uses fluid grids and media-query tuning to keep content readable across breakpoints and zoom levels.',
  },
]

const footerLinks = {
  Product: ['Scan Center', 'Threat Feed', 'Reports', 'Dashboard'],
  Resources: ['Documentation', 'Playbooks', 'FAQ', 'Status'],
  Company: ['About', 'Careers', 'Contact', 'Privacy'],
}

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

        <section className="landing-section-grid">
          {detailCards.map((item) => (
            <SurfacePanel key={item.title} className="landing-detail-card">
              <item.icon size={18} className="feature-icon" />
              <h3 className="cyber-title landing-card-title">{item.title}</h3>
              <p className="cyber-subtitle">{item.desc}</p>
            </SurfacePanel>
          ))}
        </section>

        <section className="landing-two-col">
          <SurfacePanel>
            <p className="cyber-label">Testimonials</p>
            <h2 className="cyber-title landing-section-title">Trusted by cyber operations teams</h2>
            <div className="landing-testimonials">
              {testimonials.map((item) => (
                <article key={item.name} className="hud-panel landing-testimonial-card">
                  <p className="cyber-subtitle">“{item.quote}”</p>
                  <p className="landing-testimonial-name">{item.name}</p>
                  <p className="landing-testimonial-role">{item.role}</p>
                </article>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel>
            <p className="cyber-label">FAQ</p>
            <h2 className="cyber-title landing-section-title">Questions security teams ask</h2>
            <div className="landing-faq-list">
              {faqItems.map((item) => (
                <details key={item.question} className="landing-faq-item">
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </SurfacePanel>
        </section>

        <section className="landing-two-col">
          <SurfacePanel>
            <p className="cyber-label">Contact</p>
            <h2 className="cyber-title landing-section-title">Talk to the CyberShield team</h2>
            <p className="cyber-subtitle">Send your SOC requirements and we’ll help map the best workflow setup for your team.</p>
            <form className="landing-contact-form" onSubmit={(e) => e.preventDefault()}>
              <label className="form-field" htmlFor="contactName">
                <span className="form-label">Name</span>
                <input id="contactName" className="cyber-input" placeholder="Jane Doe" />
              </label>
              <label className="form-field" htmlFor="contactEmail">
                <span className="form-label">Email</span>
                <input id="contactEmail" type="email" className="cyber-input" placeholder="you@company.com" />
              </label>
              <label className="form-field" htmlFor="contactMsg">
                <span className="form-label">Message</span>
                <textarea id="contactMsg" className="cyber-input landing-contact-textarea" placeholder="Tell us what your SOC needs..." />
              </label>
              <Button className="w-full" type="submit">
                Send message
              </Button>
            </form>
          </SurfacePanel>

          <SurfacePanel className="landing-contact-details">
            <h2 className="cyber-title landing-section-title">Reach us directly</h2>
            <div className="landing-contact-item">
              <Mail size={16} className="icon-muted" />
              <span>ops@cybershield.example</span>
            </div>
            <div className="landing-contact-item">
              <Phone size={16} className="icon-muted" />
              <span>+1 (555) 010-1420</span>
            </div>
            <div className="landing-contact-item">
              <Building2 size={16} className="icon-muted" />
              <span>Cyber Operations District, SecOps Tower</span>
            </div>
            <p className="cyber-subtitle">Available Monday-Friday, 09:00-18:00 UTC for product and deployment queries.</p>
          </SurfacePanel>
        </section>

        <footer className="landing-footer">
          <SurfacePanel className="landing-footer-panel">
            <div>
              <p className="cyber-label">CyberShield</p>
              <p className="cyber-subtitle">Built for SaaS-style cyber SOC operations, threat triage, and analyst reporting workflows.</p>
            </div>
            <div className="landing-footer-links">
              {Object.entries(footerLinks).map(([group, links]) => (
                <div key={group}>
                  <p className="landing-footer-heading">{group}</p>
                  <ul>
                    {links.map((item) => (
                      <li key={item}>
                        <a href="#">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SurfacePanel>
        </footer>
      </div>
    </div>
  )
}
