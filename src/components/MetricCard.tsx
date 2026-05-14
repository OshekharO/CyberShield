import { memo } from 'react'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded'
import { SurfacePanel } from './ui/surface-panel'

interface Props {
  label: string
  value: string | number
}

function MetricCardBase({ label, value }: Props) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
      <SurfacePanel className="p-4">
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography className="cyber-label">{label}</Typography>
          <TrendingUpRounded color="primary" fontSize="small" />
        </Box>
        <Typography className="mt-2 text-2xl font-semibold text-[var(--text-0)]">{value}</Typography>
      </SurfacePanel>
    </motion.div>
  )
}

export const MetricCard = memo(MetricCardBase)
