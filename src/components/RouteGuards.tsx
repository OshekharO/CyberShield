import { Navigate, Outlet } from 'react-router-dom'
import { TerminalBlock } from './ui/terminal-block'
import { useAuthStore } from '../store/authStore'

export function ProtectedRoute() {
  const { user, loading } = useAuthStore()
  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <TerminalBlock>
          <p className="text-sm text-[var(--text-1)]">Initializing secure session...</p>
        </TerminalBlock>
      </div>
    )
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export function AdminRoute() {
  const { user } = useAuthStore()
  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
