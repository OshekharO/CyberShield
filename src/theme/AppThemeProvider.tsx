import type { ReactNode } from 'react'

interface AppThemeProviderProps {
  children: ReactNode
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return <>{children}</>
}
