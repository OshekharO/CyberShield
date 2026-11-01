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
        <header className="hero">
          <span className="status-chip status-low" style={{ margin: '0 auto' }}>
            <Sparkles size={12} />
            Enterprise Threat Intelligence Platform
          </span>

          <h1 className="cyber-title hero-title">
            Unified threat triage for modern <span>security operations</span>
          </h1>

          <p className="cyber-subtitle" style={{ maxWidth: '44rem', margin: '0 auto' }}>
            Automate indicator enrichment across IPs, domains, URLs, and emails. Generate AI-synthesized mitigation reports in minutes.
          </p>

          <div className="hero-actions">
            <Link to="/signup">
              <Button size="lg" endIcon={<ArrowRight size={16} />}>
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </header>

        <div className="landing-highlights">
          {highlights.map((item) => (
            <div key={item} className="hud-panel highlight-item">
              <CheckCircle2 size={16} className="feature-icon" />
              <span className="cyber-subtitle" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        <section className="feature-grid">
          {features.map((feature) => (
            <SurfacePanel key={feature.title} className="feature-card">
              <feature.icon size={22} className="feature-icon" />
              <h2 className="cyber-title" style={{ fontSize: '1.15rem', marginTop: '1rem' }}>
                {feature.title}
              </h2>
              <p className="cyber-subtitle" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                {feature.desc}
              </p>
            </SurfacePanel>
          ))}
        </section>

        <section className="landing-section-grid">
          {detailCards.map((item) => (
            <SurfacePanel key={item.title} className="landing-detail-card">
              <item.icon size={20} className="feature-icon" />
              <h3 className="cyber-title landing-card-title">{item.title}</h3>
              <p className="cyber-subtitle" style={{ fontSize: '0.875rem' }}>{item.desc}</p>
            </SurfacePanel>
          ))}
        </section>

        <section className="landing-two-col">
          <SurfacePanel>
            <p className="cyber-label">Testimonials</p>
            <h2 className="cyber-title landing-section-title">Trusted by SOC Leads and Analysts</h2>
            <div className="landing-testimonials">
              {testimonials.map((item) => (
                <article key={item.name} className="hud-panel landing-testimonial-card">
                  <p className="cyber-subtitle" style={{ fontSize: '0.875rem' }}>“{item.quote}”</p>
                  <div>
                    <p className="landing-testimonial-name">{item.name}</p>
                    <p className="landing-testimonial-role">{item.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel>
            <p className="cyber-label">Knowledge Base</p>
            <h2 className="cyber-title landing-section-title">Frequently Asked Questions</h2>
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
            <p className="cyber-label">Get in Touch</p>
            <h2 className="cyber-title landing-section-title">Talk to our Solutions Engineering Team</h2>
            <p className="cyber-subtitle" style={{ fontSize: '0.875rem' }}>
              Schedule a technical walk-through or discuss customized provider integrations for your environment.
            </p>
            <form className="landing-contact-form" onSubmit={(e) => e.preventDefault()}>
              <label className="form-field" htmlFor="contactName">
                <span className="form-label">Full Name</span>
                <input id="contactName" className="cyber-input" placeholder="Jane Doe" />
              </label>
              <label className="form-field" htmlFor="contactEmail">
                <span className="form-label">Work Email</span>
                <input id="contactEmail" type="email" className="cyber-input" placeholder="jane@company.com" />
              </label>
              <label className="form-field" htmlFor="contactMsg">
                <span className="form-label">Message</span>
                <textarea id="contactMsg" className="landing-contact-textarea" placeholder="How can we help your security operations team?" />
              </label>
              <Button className="w-full" type="submit">
                Submit Inquiry
              </Button>
            </form>
          </SurfacePanel>

          <SurfacePanel className="landing-contact-details">
            <p className="cyber-label">Direct Contacts</p>
            <h2 className="cyber-title landing-section-title">Headquarters & Availability</h2>
            <div className="landing-contact-item">
              <Mail size={16} className="feature-icon" />
              <span>security-ops@cybershield.example</span>
            </div>
            <div className="landing-contact-item">
              <Phone size={16} className="feature-icon" />
              <span>+1 (800) 555-0199</span>
            </div>
            <div className="landing-contact-item">
              <Building2 size={16} className="feature-icon" />
              <span>San Francisco HQ, Cyber Operations Tower</span>
            </div>
            <p className="cyber-subtitle" style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
              Our security engineering support desk operates 24/7 for critical enterprise incident response integrations.
            </p>
          </SurfacePanel>
        </section>

        <footer className="landing-footer">
          <SurfacePanel className="landing-footer-panel">
            <div>
              <p className="cyber-title" style={{ fontSize: '1.05rem', fontWeight: 700 }}>CyberShield</p>
              <p className="cyber-subtitle" style={{ fontSize: '0.8125rem', marginTop: '0.25rem', maxWidth: '22rem' }}>
                Enterprise threat intelligence platform for indicators, risk correlation, and analyst reporting.
              </p>
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
