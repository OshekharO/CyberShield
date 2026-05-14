import * as React from 'react'
import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button'
import { cn } from '../../utils/cn'

type Variant = 'default' | 'ghost' | 'outline' | 'danger'
type Size = 'default' | 'sm' | 'lg'

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size' | 'color'> {
  variant?: Variant
  size?: Size
}

const sizeMap: Record<Size, MuiButtonProps['size']> = {
  default: 'medium',
  sm: 'small',
  lg: 'large',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const muiVariant: MuiButtonProps['variant'] = variant === 'ghost' ? 'text' : variant === 'outline' ? 'outlined' : 'contained'
  const color: MuiButtonProps['color'] = variant === 'danger' ? 'error' : 'primary'

  return (
    <MuiButton
      ref={ref}
      variant={muiVariant}
      color={color}
      size={sizeMap[size]}
      disableElevation
      className={cn(className)}
      sx={
        variant === 'ghost'
          ? {
              color: 'var(--text-1)',
              '&:hover': { backgroundColor: 'var(--brand-soft)', color: 'var(--text-0)' },
            }
          : undefined
      }
      {...props}
    />
  )
})
Button.displayName = 'Button'
