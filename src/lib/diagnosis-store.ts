'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  DiagnosisResult,
  ModuleId,
  UserProfile,
} from '@/lib/types'

interface DiagnosisState {
  // User profile
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void

  // Active module
  activeModule: ModuleId | null
  setActiveModule: (id: ModuleId | null) => void

  // Results per module
  results: Record<ModuleId, DiagnosisResult | null>

  // Per-module loading state
  loadingModules: Record<ModuleId, boolean>

  setResult: (id: ModuleId, result: DiagnosisResult) => void
  clearResult: (id: ModuleId) => void
  setLoading: (id: ModuleId, loading: boolean) => void
  clearAllResults: () => void

  // Completed modules count
  completedCount: () => number

  // Report generation state
  reportLoading: boolean
  setReportLoading: (b: boolean) => void

  // Last generated report
  lastReport: {
    overallSummary: string
    overallRiskScore: number
    topFindings: DiagnosisResult['findings']
    prioritizedRecommendations: string[]
    redFlags: string[]
    nextSteps: string[]
    createdAt: string
  } | null
  setLastReport: (r: DiagnosisState['lastReport']) => void
}

const emptyResults: Record<ModuleId, DiagnosisResult | null> = {
  skin: null,
  eye: null,
  face: null,
  voice: null,
  symptom: null,
  mental: null,
  vitals: null,
  reaction: null,
}

const emptyLoading: Record<ModuleId, boolean> = {
  skin: false,
  eye: false,
  face: false,
  voice: false,
  symptom: false,
  mental: false,
  vitals: false,
  reaction: false,
}

export const useDiagnosisStore = create<DiagnosisState>()(
  persist(
    (set, get) => ({
      userProfile: {
        name: '',
        age: '',
        gender: '',
      },
      setUserProfile: (profile) => set({ userProfile: profile }),

      activeModule: null,
      setActiveModule: (id) => set({ activeModule: id }),

      results: { ...emptyResults },
      loadingModules: { ...emptyLoading },

      setResult: (id, result) =>
        set((state) => ({
          results: { ...state.results, [id]: result },
        })),

      clearResult: (id) =>
        set((state) => ({
          results: { ...state.results, [id]: null },
        })),

      setLoading: (id, loading) =>
        set((state) => ({
          loadingModules: { ...state.loadingModules, [id]: loading },
        })),

      clearAllResults: () =>
        set({
          results: { ...emptyResults },
          lastReport: null,
        }),

      completedCount: () =>
        Object.values(get().results).filter(Boolean).length,

      reportLoading: false,
      setReportLoading: (b) => set({ reportLoading: b }),

      lastReport: null,
      setLastReport: (r) => set({ lastReport: r }),
    }),
    {
      name: 'mediscan-store',
      // Only persist user profile and results, not loading/active state
      partialize: (state) => ({
        userProfile: state.userProfile,
        results: state.results,
        lastReport: state.lastReport,
      }),
    }
  )
)
