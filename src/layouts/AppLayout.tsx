import { NavLink, Outlet } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DashboardRounded from '@mui/icons-material/DashboardRounded'
import SearchRounded from '@mui/icons-material/SearchRounded'
import FeedRounded from '@mui/icons-material/FeedRounded'
import SummarizeRounded from '@mui/icons-material/SummarizeRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import AdminPanelSettingsRounded from '@mui/icons-material/AdminPanelSettingsRounded'
import VerifiedUserRounded from '@mui/icons-material/VerifiedUserRounded'
import ExitToAppRounded from '@mui/icons-material/ExitToAppRounded'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { GlitchText } from '../components/ui/glitch-text'
import { SurfacePanel } from '../components/ui/surface-panel'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: DashboardRounded },
  { to: '/scan-center', label: 'Scan Center', icon: SearchRounded },
  { to: '/threat-feed', label: 'Threat Feed', icon: FeedRounded },
  { to: '/reports', label: 'Reports', icon: SummarizeRounded },
  { to: '/settings', label: 'Settings', icon: SettingsRounded },
]

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <Box className="min-h-screen px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
      <Box className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[290px_minmax(0,1fr)] xl:gap-6">
        <SurfacePanel className="scanline-overlay p-5 sm:p-6 lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-auto">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box>
              <Typography className="cyber-label">CyberShield</Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                  <VerifiedUserRounded sx={{ fontSize: 14 }} />
                </Avatar>
                <Typography className="cyber-title" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                  <GlitchText text="OPERATIONS" className="inline-block" />
                </Typography>
              </Stack>
            </Box>
            <ThemeToggle />
          </Stack>

          <List disablePadding sx={{ display: 'grid', gap: 0.8 }}>
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: isActive ? 'primary.main' : 'transparent',
                      bgcolor: isActive ? 'rgba(56, 189, 248, 0.14)' : 'transparent',
                      color: isActive ? 'primary.main' : 'text.secondary',
                      transition: 'all 160ms ease',
                      '&:hover': { borderColor: 'divider', bgcolor: 'rgba(56, 189, 248, 0.08)', color: 'text.primary' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.92rem', fontWeight: 600 }} />
                  </ListItemButton>
                )}
              </NavLink>
            ))}

            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: isActive ? 'primary.main' : 'transparent',
                      bgcolor: isActive ? 'rgba(56, 189, 248, 0.14)' : 'transparent',
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                      <AdminPanelSettingsRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Admin" primaryTypographyProps={{ fontSize: '0.92rem', fontWeight: 600 }} />
                  </ListItemButton>
                )}
              </NavLink>
            )}
          </List>

          <Box className="hud-panel" sx={{ mt: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Avatar sx={{ width: 34, height: 34 }}>{(user?.name ?? 'U').slice(0, 1).toUpperCase()}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap fontSize="0.9rem" fontWeight={600} color="text.primary">
                  {user?.name}
                </Typography>
                <Typography noWrap fontSize="0.75rem" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
            <Button type="button" variant="ghost" size="sm" className="w-full justify-start" startIcon={<ExitToAppRounded fontSize="small" />} onClick={() => void logout()}>
              Sign out
            </Button>
          </Box>
        </SurfacePanel>

        <main className="min-w-0 space-y-6">
          <header className="hero-gradient relative overflow-hidden rounded-2xl border border-[var(--line-strong)] px-5 py-5 text-sm text-[var(--text-1)] shadow-[var(--shadow-soft)] sm:px-6">
            <svg className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 opacity-30" viewBox="0 0 200 200" fill="none" aria-hidden="true">
              <path d="M43.2,-63.1C57.2,-57.7,70.3,-48.4,76,-35.2C81.7,-22,80.2,-4.9,74.7,9.9C69.2,24.7,59.8,37.2,47.6,47.8C35.4,58.4,20.4,67.2,4.2,70.9C-12,74.5,-24,73,-36,67.5C-48.1,62,-60.1,52.4,-67.6,39.8C-75.2,27.2,-78.3,11.6,-76.4,-2.8C-74.6,-17.2,-67.8,-30.4,-58.4,-41.4C-49,-52.4,-37,-61.3,-24,-66C-11,-70.8,3,-71.3,16.8,-67.9C30.6,-64.5,44.2,-57.1,43.2,-63.1Z" fill="currentColor" />
            </svg>
            <Typography className="cyber-label">Live workspace</Typography>
            <Typography sx={{ mt: 1, color: 'text.secondary' }}>
              Real-time threat scanning, triage, and reporting across your security operations workflow.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
              <Chip size="small" color="primary" label="Real-time" />
              <Chip size="small" color="secondary" label="AI-assisted" />
              <Chip size="small" label="SOC-ready" variant="outlined" />
            </Stack>
          </header>
          <div className="px-1.5 sm:px-2">
            <Outlet />
          </div>
        </main>
      </Box>
    </Box>
  )
}
