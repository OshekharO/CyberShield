import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AdminRoute, ProtectedRoute } from './components/RouteGuards'
import { useAuthStore } from './store/authStore'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ScanCenterPage = lazy(() => import('./pages/ScanCenterPage'))
const ThreatFeedPage = lazy(() => import('./pages/ThreatFeedPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'))

function App() {
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-base-content/70">Loading CyberShield…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/scan-center" element={<ScanCenterPage />} />
              <Route path="/threat-feed" element={<ThreatFeedPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/user-management" element={<UserManagementPage />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
