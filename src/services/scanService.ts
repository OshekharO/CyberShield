import { api } from './api'
import type { ScanResponse, ScanType } from '../types'

export const scanService = {
  runScan: async (type: ScanType, target: string) => {
    const { data } = await api.post<ScanResponse>(`/api/scan/${type}`, { target })
    return data
  },
}
