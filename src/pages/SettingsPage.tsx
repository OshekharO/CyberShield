import { useState } from 'react'
import { Button } from '../components/ui/button'
import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { TerminalBlock } from '../components/ui/terminal-block'
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
        <HUDHeader title="Settings" subtitle="Configure API keys, provider thresholds, and SOC profile preferences." glitch />
        <TerminalBlock className="mt-4">Settings are managed via deployment environment variables and secured server-side controls.</TerminalBlock>
      </SurfacePanel>

      {user?.role === 'ADMIN' && (
        <SurfacePanel>
          <HUDHeader title="Data Retention" subtitle="Manually trigger retention cleanup for logs and scan records." />
          <div className="stack-2 mt-3">
            <Button variant="outline" onClick={runCleanup} disabled={loadingCleanup}>
              {loadingCleanup ? 'Running cleanup...' : 'Run retention cleanup now'}
            </Button>
            {cleanupError && <p className="form-error">{cleanupError}</p>}
            {cleanupResult && (
              <TerminalBlock>
                <p className="helper-text">
                  Cleanup completed by {cleanupResult.triggeredBy}. Deleted {cleanupResult.deleted.apiLogs} API logs and{' '}
                  {cleanupResult.deleted.scanResults} scan results.
                </p>
              </TerminalBlock>
            )}
          </div>
        </SurfacePanel>
      )}
    </div>
  )
}
