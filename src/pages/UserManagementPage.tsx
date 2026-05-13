import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { TerminalBlock } from '../components/ui/terminal-block'

export default function UserManagementPage() {
  return (
    <SurfacePanel>
      <HUDHeader title="User Management" subtitle="Role permissions and account ban controls are managed from the Admin panel." glitch />
      <TerminalBlock className="mt-4">Use Admin Analytics for operational user controls and enforcement actions.</TerminalBlock>
    </SurfacePanel>
  )
}
