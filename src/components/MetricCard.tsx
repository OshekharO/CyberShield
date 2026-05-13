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
      <Card>
        <p className="text-sm text-slate-400">{label}</p>
        <h3 className="mt-2 text-2xl font-semibold text-cyan-300">{value}</h3>
      </Card>
    </motion.div>
  )
}

export const MetricCard = memo(MetricCardBase)
