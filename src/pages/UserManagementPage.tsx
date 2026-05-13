import { SurfacePanel } from '../components/ui/surface-panel'
import { HUDHeader } from '../components/ui/hud-header'
import { TerminalBlock } from '../components/ui/terminal-block'

export default function UserManagementPage() {
  return (
    <SurfacePanel className="space-y-4">
      <HUDHeader title="User management" subtitle="Role permissions and account enforcement actions are centralized inside the Admin view." />
      <TerminalBlock>Use Admin Analytics for operational user controls and enforcement actions.</TerminalBlock>
    </SurfacePanel>
  )
}
