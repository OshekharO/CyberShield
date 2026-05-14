import { useMemo, type ReactNode } from 'react'
import { CssBaseline, ThemeProvider, alpha, createTheme } from '@mui/material'
import { useThemeStore } from '../store/themeStore'

interface AppThemeProviderProps {
  children: ReactNode
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const mode = useThemeStore((s) => s.theme)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === 'dark' ? '#38bdf8' : '#0284c7' },
          secondary: { main: mode === 'dark' ? '#818cf8' : '#4f46e5' },
          error: { main: '#f43f5e' },
          background: {
            default: mode === 'dark' ? '#020617' : '#f8fafc',
            paper: mode === 'dark' ? alpha('#0f172a', 0.88) : alpha('#ffffff', 0.9),
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ':root': {
                '--mui-brand': mode === 'dark' ? '#38bdf8' : '#0284c7',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(10px)',
                border: `1px solid ${mode === 'dark' ? 'rgba(148,163,184,0.24)' : 'rgba(148,163,184,0.3)'}`,
                backgroundImage:
                  mode === 'dark'
                    ? 'linear-gradient(160deg, rgba(15,23,42,0.82), rgba(15,23,42,0.62))'
                    : 'linear-gradient(160deg, rgba(255,255,255,0.94), rgba(255,255,255,0.8))',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
