import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { TerminalBlock } from '../components/ui/terminal-block'

export default function SettingsPage() {
  return (
    <SurfacePanel>
      <HUDHeader title="Settings" subtitle="Configure API keys, provider thresholds, and SOC profile preferences." glitch />
      <TerminalBlock className="mt-4">
        Settings are managed via deployment environment variables and secured server-side controls.
      </TerminalBlock>
    </SurfacePanel>
  )
}
