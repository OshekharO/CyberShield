import { NavLink, Outlet } from 'react-router-dom'
import { Shield, ScanSearch, Activity, FileSpreadsheet, Settings, Users } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuthStore } from '../store/authStore'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Shield },
  { to: '/scan-center', label: 'Scan Center', icon: ScanSearch },
  { to: '/threat-feed', label: 'Threat Feed', icon: Activity },
  { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-700/60 bg-slate-900/75 p-4 backdrop-blur-md">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-cyan-300">CyberShield X</h1>
            <ThemeToggle />
          </div>
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Users size={16} />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="mt-8 rounded-xl border border-slate-700/60 p-3 text-xs text-slate-300">
            <p className="font-medium text-slate-100">{user?.name}</p>
            <p>{user?.email}</p>
            <button type="button" onClick={logout} className="mt-3 text-cyan-300">
              Logout
            </button>
          </div>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
