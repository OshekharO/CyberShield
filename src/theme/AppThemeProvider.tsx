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
          h1: { fontWeight: 700, letterSpacing: '-0.02em' },
          h2: { fontWeight: 700, letterSpacing: '-0.02em' },
          h3: { fontWeight: 650, letterSpacing: '-0.01em' },
          body1: { lineHeight: 1.65 },
          body2: { lineHeight: 1.6 },
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
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                minHeight: 48,
                backgroundColor: mode === 'dark' ? alpha('#0f172a', 0.82) : alpha('#ffffff', 0.95),
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? 'rgba(148,163,184,0.3)' : 'rgba(148,163,184,0.45)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? 'rgba(56,189,248,0.5)' : 'rgba(2,132,199,0.5)',
                },
              },
              input: {
                paddingTop: 12,
                paddingBottom: 12,
              },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: {
                fontSize: '0.9rem',
                fontWeight: 600,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 12,
                minHeight: 40,
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
