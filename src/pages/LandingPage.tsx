import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Radar, ShieldCheck, Sparkles, Workflow } from 'lucide-react'

const features = [
  { icon: ShieldCheck, title: 'Threat Intelligence', desc: 'Scan URL, email, IP, and domain indicators in one workspace.' },
  { icon: Radar, title: 'Analyst Insights', desc: 'Convert scan outcomes into clear AI-assisted incident summaries.' },
  { icon: Workflow, title: 'Operational Ready', desc: 'Built for modern teams with secure auth and role-based access.' },
]

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <section className="relative overflow-hidden rounded-3xl border border-slate-300/70 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-12">
        <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-cyan-700 dark:text-cyan-300">
          <Sparkles size={14} />
          Security operations platform
        </p>
        <h1 className="relative mt-5 text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-6xl">CyberShield X</h1>
        <p className="relative mt-4 max-w-2xl text-slate-600 dark:text-slate-300 md:text-lg">
          Professional cyber intelligence workflow for monitoring, triage, and reporting across your full IOC pipeline.
        </p>

        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Start free <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-slate-300/70 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
          >
            <feature.icon className="text-cyan-600 dark:text-cyan-300" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  )
}
