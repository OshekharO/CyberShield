import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ProtectedRoute() {
  const { user, loading } = useAuthStore()
  if (loading) return <div className="p-8 text-slate-300">Loading session...</div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export function AdminRoute() {
  const { user } = useAuthStore()
  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
