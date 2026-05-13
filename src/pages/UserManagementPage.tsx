import { Card } from '../components/ui/card'

export default function UserManagementPage() {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">User Management</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Role permissions and account ban controls are managed from the Admin panel.
      </p>
    </Card>
  )
}
