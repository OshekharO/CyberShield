import { create } from 'zustand'
import type { ScanResponse } from '../types'

interface ScanState {
  history: ScanResponse[]
  addResult: (scan: ScanResponse) => void
}

export const useScanStore = create<ScanState>((set) => ({
  history: [],
  addResult: (scan) => set((state) => ({ history: [scan, ...state.history].slice(0, 100) })),
}))
