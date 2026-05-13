import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export const CyberSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-11 w-full appearance-none rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 pr-10 text-sm text-[var(--text-0)] transition focus-visible:border-sky-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/45',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-2)]" />
    </div>
  ),
)
CyberSelect.displayName = 'CyberSelect'
