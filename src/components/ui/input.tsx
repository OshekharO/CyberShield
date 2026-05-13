import * as React from 'react'
import { cn } from '../../utils/cn'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-11 w-full border border-[var(--line)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text-0)] placeholder:text-[var(--text-2)] transition focus-visible:border-cyan-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 [clip-path:polygon(0.6rem_0,calc(100%-0.6rem)_0,100%_0.6rem,100%_calc(100%-0.6rem),calc(100%-0.6rem)_100%,0.6rem_100%,0_calc(100%-0.6rem),0_0.6rem)]',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
