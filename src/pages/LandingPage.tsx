import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Radar, Workflow } from 'lucide-react'

const features = [
  { icon: ShieldCheck, title: 'Threat Intelligence', desc: 'IP, URL, email and domain signals in one workflow.' },
  { icon: Radar, title: 'SOC-grade Insights', desc: 'AI-assisted analyst summaries with rule-based scoring.' },
  { icon: Workflow, title: 'Enterprise Ready', desc: 'Vercel serverless + Supabase Postgres deployment path.' },
]

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-slate-100">
      <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-10 text-center shadow-glass">
        <h1 className="text-5xl font-bold text-cyan-300">CyberShield X</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          AI-assisted cyber threat intelligence platform for modern SOC teams.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/login" className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-slate-950">
            Login
          </Link>
          <Link to="/signup" className="rounded-xl border border-cyan-400/40 px-5 py-2 text-cyan-300">
            Get Started
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <motion.div key={f.title} whileHover={{ y: -4 }} className="rounded-2xl border border-slate-700/50 bg-slate-900/70 p-5">
            <f.icon className="text-cyan-300" />
            <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
