import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Rss,
  FileText,
  Settings,
  Shield,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { GlitchText } from '../components/ui/glitch-text'
import { SurfacePanel } from '../components/ui/surface-panel'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/scan-center', label: 'Scan Center', icon: Search },
  { to: '/threat-feed', label: 'Threat Feed', icon: Rss },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="app-shell">
      <div className="app-grid">
        <SurfacePanel className="sidebar scanline-overlay">
          <div className="sidebar-head">
            <div>
              <p className="cyber-label">CyberShield</p>
              <div className="brand-title">
                <span className="brand-dot" aria-hidden="true">
                  <ShieldCheck size={14} />
                </span>
                <p className="cyber-title" style={{ fontSize: '1rem' }}>
                  <GlitchText text="OPERATIONS" className="inline-block" />
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <ul className="nav-list">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}

            {user?.role === 'ADMIN' && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <Shield size={16} />
                  <span>Admin</span>
                </NavLink>
              </li>
            )}
          </ul>

          <div className="hud-panel profile-box">
            <div className="profile-head">
              <span className="profile-avatar">{(user?.name ?? 'U').slice(0, 1).toUpperCase()}</span>
              <div className="profile-meta">
                <p className="profile-name">{user?.name}</p>
                <p className="profile-email">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full" startIcon={<LogOut size={14} />} onClick={() => void logout()}>
              Sign out
            </Button>
          </div>
        </SurfacePanel>

        <main className="main-content">
          <header className="live-header hero-gradient">
            <p className="cyber-label">Live workspace</p>
            <p className="helper-text">Real-time threat scanning, triage, and reporting across your security operations workflow.</p>
            <div className="live-tags">
              <span className="live-tag brand">Real-time</span>
              <span className="live-tag brand">AI-assisted</span>
              <span className="live-tag">SOC-ready</span>
            </div>
          </header>
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
