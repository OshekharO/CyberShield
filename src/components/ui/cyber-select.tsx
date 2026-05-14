import * as React from 'react'
import { cn } from '../../utils/cn'

export const CyberSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn('cyber-select', className)} {...props}>
    {children}
  </select>
))
CyberSelect.displayName = 'CyberSelect'
