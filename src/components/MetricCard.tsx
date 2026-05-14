import { memo } from 'react'
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
    <SurfacePanel className="p-5 sm:p-6">
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
        <Typography className="cyber-label">{label}</Typography>
        <TrendingUpRounded color="primary" fontSize="small" />
      </Box>
      <Typography className="mt-3 text-2xl font-semibold text-[var(--text-0)]">{value}</Typography>
    </SurfacePanel>
  )
}

export const MetricCard = memo(MetricCardBase)
