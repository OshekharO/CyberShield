import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 active:translate-y-[1px]',
  {
    variants: {
      variant: {
        default:
          'border-sky-400/50 bg-sky-500/15 text-sky-100 shadow-[0_0_0_1px_rgba(56,189,248,0.28),0_10px_20px_rgba(2,132,199,0.25)] hover:border-sky-300/75 hover:bg-sky-500/25 focus-visible:ring-sky-300/70',
        ghost:
          'border-transparent bg-transparent text-[var(--text-1)] hover:border-[var(--line)] hover:bg-[var(--brand-soft)] hover:text-[var(--text-0)] focus-visible:ring-sky-300/70',
        outline:
          'border-[var(--line)] bg-[var(--surface-1)] text-[var(--text-0)] hover:border-sky-400/60 hover:bg-[var(--brand-soft)] focus-visible:ring-sky-300/70',
        danger:
          'border-rose-400/45 bg-rose-500/18 text-rose-100 shadow-[0_0_0_1px_rgba(244,63,94,0.22),0_10px_18px_rgba(225,29,72,0.22)] hover:bg-rose-500/24 focus-visible:ring-rose-300/70',
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
