import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Radar, ShieldCheck, Sparkles, Workflow } from 'lucide-react'

const features = [
  { icon: ShieldCheck, title: 'Threat Intelligence', desc: 'IP, URL, email and domain signals in one workflow.' },
  { icon: Radar, title: 'SOC-grade Insights', desc: 'AI-assisted analyst summaries with rule-based scoring.' },
  { icon: Workflow, title: 'Enterprise Ready', desc: 'Vercel serverless + Supabase Postgres deployment path.' },
]

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 text-slate-100 md:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 p-8 shadow-2xl backdrop-blur-xl md:p-12">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.15em] text-cyan-200">
            <Sparkles size={14} />
            SOC-ready platform
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-6xl">
            CyberShield X
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300 md:text-lg">
            A modern cyber intelligence workspace for URL, email, IP, and domain analysis with AI-assisted summaries.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-300"
            >
              Get Started <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-cyan-300/40 bg-slate-800/50 px-5 py-2.5 text-cyan-200 transition hover:bg-slate-800"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <motion.div
            key={f.title}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-sm"
          >
            <f.icon className="text-cyan-300" />
            <h3 className="mt-3 text-lg font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
