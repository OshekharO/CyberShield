import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { TerminalBlock } from '../components/ui/terminal-block'

export default function SettingsPage() {
  return (
    <SurfacePanel className="space-y-4">
      <HUDHeader title="Settings" subtitle="Review how CyberShield is configured across API access, thresholds, and workspace defaults." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-box border border-base-300/60 bg-base-200/50 p-5">
          <h3 className="text-lg font-semibold">Environment-backed controls</h3>
          <p className="mt-2 text-sm leading-6 text-base-content/70">Provider keys, model settings, and sensitive configuration stay on the server side.</p>
        </div>
        <TerminalBlock>
          Settings are managed via deployment environment variables and secured server-side controls.
        </TerminalBlock>
      </div>
    </SurfacePanel>
  )
}
