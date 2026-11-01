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
  const bottomLinks = [
    ...links.map(({ to, label, icon }) => ({
      to,
      label,
      icon,
    })),
    ...(user?.role === 'ADMIN' ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ]

  return (
    <div className="app-shell">
      <div className="app-grid">
        <aside className="sidebar">
          <div className="sidebar-head">
            <div className="brand-title">
              <span className="brand-dot" aria-hidden="true">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="cyber-title" style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                  CyberShield
                </p>
                <p className="cyber-label" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                  Enterprise SecOps
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

          <div className="profile-box">
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
        </aside>

        <main className="main-content">
          <header className="mobile-topbar">
            <div className="mobile-topbar-head">
              <div className="brand-title">
                <span className="brand-dot" aria-hidden="true">
                  <ShieldCheck size={18} />
                </span>
                <p className="cyber-title" style={{ fontSize: '0.95rem' }}>
                  CyberShield
                </p>
              </div>
              <div className="mobile-topbar-actions">
                <ThemeToggle />
                <Button variant="ghost" size="sm" startIcon={<LogOut size={14} />} onClick={() => void logout()}>
                  Sign out
                </Button>
              </div>
            </div>
          </header>

          <div className="live-header" style={{ padding: '0.85rem 1rem', background: 'var(--surface-0)', borderBottom: '1px solid var(--line)' }}>
            <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <p className="cyber-title" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Security Workspace</p>
                  <span className="hud-defcon-pill">DEFCON 4</span>
                </div>
                <p className="helper-text" style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem' }}>
                  Enterprise SOC telemetry, automated triage, and live threat intelligence.
                </p>
              </div>
              <div className="live-tags" style={{ marginTop: 0, gap: '0.5rem' }}>
                <span className="live-tag scan-pulse-tag" style={{ fontSize: '0.72rem' }}>
                  <span className="scan-pulse-dot" aria-hidden="true" />
                  Active Telemetry
                </span>
                <span className="live-tag brand" style={{ fontSize: '0.72rem' }}>SOC 2 Certified</span>
              </div>
            </div>
          </div>
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>

      <nav className={`bottom-nav${user?.role === 'ADMIN' ? ' with-admin' : ''}`} aria-label="Primary mobile navigation">
        {bottomLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            aria-label={label}
            className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
