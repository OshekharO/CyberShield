import { Card } from '../components/ui/card'

export default function SettingsPage() {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Settings</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Configure API keys, provider thresholds, and SOC profile preferences using deployment environment variables.
      </p>
    </Card>
  )
}
