import * as React from 'react'
import TextField from '@mui/material/TextField'
import { cn } from '../../utils/cn'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <TextField
    inputRef={ref}
    variant="outlined"
    size="small"
    fullWidth
    className={cn(
      '[&_.MuiInputBase-input]:text-sm [&_.MuiInputBase-input::placeholder]:text-[var(--text-2)] [&_.MuiInputBase-input]:text-[var(--text-0)]',
      className,
    )}
    {...(props as React.ComponentProps<typeof TextField>)}
  />
))
Input.displayName = 'Input'
