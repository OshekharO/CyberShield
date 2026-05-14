import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { cn } from '../../utils/cn'

export const CyberSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, value, onChange, disabled, name }, ref) => (
    <TextField
      select
      size="small"
      fullWidth
      value={value}
      onChange={onChange as unknown as React.ChangeEventHandler<HTMLInputElement>}
      disabled={disabled}
      name={name}
      className={cn('[&_.MuiInputBase-input]:text-sm [&_.MuiInputBase-input]:text-[var(--text-0)]', className)}
      inputRef={ref as unknown as React.Ref<HTMLInputElement>}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child) || child.type !== 'option') return child
        const option = child as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>
        return (
          <MenuItem key={option.props.value?.toString() ?? option.props.children?.toString()} value={option.props.value}>
            {option.props.children}
          </MenuItem>
        )
      })}
    </TextField>
  ),
)
CyberSelect.displayName = 'CyberSelect'
