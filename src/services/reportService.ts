import { api } from './api'

export const reportService = {
  downloadReport: async (scanId: string) => {
    const response = await api.get(`/api/export-report?scanId=${encodeURIComponent(scanId)}`, {
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cybershield-${scanId}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  },
}
