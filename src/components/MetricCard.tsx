import { memo } from 'react'
import { motion } from 'framer-motion'
import { SurfacePanel } from './ui/surface-panel'

interface Props {
  label: string
  value: string | number
}

function MetricCardBase({ label, value }: Props) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
      <SurfacePanel className="p-4">
        <p className="cyber-label">{label}</p>
        <h3 className="mt-2 text-2xl font-semibold text-[var(--text-0)]">{value}</h3>
      </SurfacePanel>
    </motion.div>
  )
}

export const MetricCard = memo(MetricCardBase)
