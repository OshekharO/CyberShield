import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 active:translate-y-[1px] [clip-path:polygon(0.65rem_0,calc(100%-0.65rem)_0,100%_0.65rem,100%_calc(100%-0.65rem),calc(100%-0.65rem)_100%,0.65rem_100%,0_calc(100%-0.65rem),0_0.65rem)]',
  {
    variants: {
      variant: {
        default:
          'border-cyan-300/60 bg-cyan-300/15 text-cyan-100 shadow-[0_0_0_1px_rgba(77,234,255,0.35),0_0_16px_rgba(77,234,255,0.24)] hover:border-cyan-200 hover:bg-cyan-300/25 focus-visible:ring-cyan-300/70',
        ghost:
          'border-transparent bg-transparent text-[var(--text-1)] hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-[var(--text-0)] focus-visible:ring-cyan-300/70',
        outline:
          'border-[var(--line)] bg-[var(--surface-1)] text-[var(--text-0)] hover:border-cyan-300/60 hover:text-cyan-100 focus-visible:ring-cyan-300/70',
        danger:
          'border-rose-400/50 bg-rose-500/20 text-rose-200 shadow-[0_0_0_1px_rgba(251,113,133,0.24),0_0_14px_rgba(251,113,133,0.2)] hover:bg-rose-500/28 focus-visible:ring-rose-300/70',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
))
Button.displayName = 'Button'
