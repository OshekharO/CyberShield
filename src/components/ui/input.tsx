import * as React from 'react'
import { cn } from '../../utils/cn'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text-0)] placeholder:text-[var(--text-2)] transition focus-visible:border-sky-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/45',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
