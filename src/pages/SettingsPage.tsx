import { useState } from 'react'
import { Button } from '../components/ui/button'
import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { adminService } from '../services/adminService'
import { useAuthStore } from '../store/authStore'
import { getApiErrorMessage } from '../utils/apiError'

interface RetentionCleanupResult {
  deleted: {
    apiLogs: number
    scanResults: number
  }
  triggeredBy: 'cron' | 'admin'
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const [loadingCleanup, setLoadingCleanup] = useState(false)
  const [cleanupError, setCleanupError] = useState('')
  const [cleanupResult, setCleanupResult] = useState<RetentionCleanupResult | null>(null)

  const runCleanup = async () => {
    setLoadingCleanup(true)
    setCleanupError('')
    try {
      const result = await adminService.runRetentionCleanup()
      setCleanupResult(result as RetentionCleanupResult)
    } catch (error) {
      setCleanupError(getApiErrorMessage(error, 'Retention cleanup failed. Please try again.'))
    } finally {
      setLoadingCleanup(false)
    }
  }

  return (
    <div className="stack-4">
      <SurfacePanel>
        <HUDHeader title="Workspace Configuration" subtitle="Review platform environment controls, provider thresholds, and compliance parameters." />
        <div className="hud-panel mt-4">
          <p className="helper-text">
            Security keys, provider API endpoints, and database connection pools are secured via deployment environment variables.
          </p>
        </div>
      </SurfacePanel>

      {user?.role === 'ADMIN' && (
        <SurfacePanel>
          <div className="row-between" style={{ marginBottom: '0.75rem' }}>
            <HUDHeader title="Data Retention Management" subtitle="Execute on-demand retention enforcement for audit logs and scan histories." />
            <span className="live-tag brand">Retention Policy</span>
          </div>
          <div className="stack-2 mt-3">
            <Button variant="outline" onClick={runCleanup} disabled={loadingCleanup}>
              {loadingCleanup ? 'Executing Retention Policy...' : 'Run Retention Cleanup Now'}
            </Button>
            {cleanupError && <p className="form-error">{cleanupError}</p>}
            {cleanupResult && (
              <div className="hud-panel" style={{ marginTop: '0.5rem' }}>
                <p className="helper-text" style={{ color: 'var(--color-safe)' }}>
                  ✓ Cleanup executed by {cleanupResult.triggeredBy}. Purged {cleanupResult.deleted.apiLogs} API audit logs and{' '}
                  {cleanupResult.deleted.scanResults} stale scan records.
                </p>
              </div>
            )}
          </div>
        </SurfacePanel>
      )}
    </div>
  )
}
