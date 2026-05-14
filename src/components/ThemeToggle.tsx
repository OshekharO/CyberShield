import IconButton from '@mui/material/IconButton'
import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <IconButton
      onClick={toggleTheme}
      aria-label="Toggle theme"
      size="small"
      sx={{
        border: '1px solid var(--line)',
        borderRadius: 2,
        color: 'var(--text-1)',
        backgroundColor: 'var(--surface-2)',
        '&:hover': {
          borderColor: 'var(--mui-brand)',
          backgroundColor: 'var(--brand-soft)',
          color: 'var(--text-0)',
        },
      }}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </IconButton>
  )
}
