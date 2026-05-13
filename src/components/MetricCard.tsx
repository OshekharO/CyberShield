import { memo } from 'react'
import { motion } from 'framer-motion'
import { Card } from './ui/card'

interface Props {
  label: string
  value: string | number
}

function MetricCardBase({ label, value }: Props) {
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Card className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</h3>
      </Card>
    </motion.div>
  )
}

export const MetricCard = memo(MetricCardBase)
