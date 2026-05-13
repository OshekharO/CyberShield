import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      className="inline-flex h-9 w-9 items-center justify-center border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text-1)] transition hover:border-cyan-300/60 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 [clip-path:polygon(0.6rem_0,calc(100%-0.6rem)_0,100%_0.6rem,100%_calc(100%-0.6rem),calc(100%-0.6rem)_100%,0.6rem_100%,0_calc(100%-0.6rem),0_0.6rem)]"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
