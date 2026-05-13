import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text-1)] transition hover:border-sky-400/60 hover:bg-[var(--brand-soft)] hover:text-[var(--text-0)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/65"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
