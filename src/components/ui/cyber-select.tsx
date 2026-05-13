import * as React from 'react'
import { cn } from '../../utils/cn'

export const CyberSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn('select select-bordered w-full', className)} {...props}>
    {children}
  </select>
))
CyberSelect.displayName = 'CyberSelect'
