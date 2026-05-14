import * as React from 'react'
import { cn } from '../../utils/cn'

type Variant = 'default' | 'ghost' | 'outline' | 'danger'
type Size = 'default' | 'sm' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', startIcon, endIcon, children, type = 'button', ...props }, ref) => {
    const variantClass =
      variant === 'ghost'
        ? 'cyber-button-ghost'
        : variant === 'outline'
          ? 'cyber-button-outline'
          : variant === 'danger'
            ? 'cyber-button-danger'
            : 'cyber-button-default'

    const sizeClass = size === 'sm' ? 'cyber-button-sm' : size === 'lg' ? 'cyber-button-lg' : 'cyber-button-default-size'

    return (
      <button ref={ref} type={type} className={cn('cyber-button', variantClass, sizeClass, className)} {...props}>
        {startIcon ? <span aria-hidden="true">{startIcon}</span> : null}
        {children}
        {endIcon ? <span aria-hidden="true">{endIcon}</span> : null}
      </button>
    )
  },
)
Button.displayName = 'Button'
