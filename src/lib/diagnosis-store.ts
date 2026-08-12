'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  MODULES,
  type DiagnosisResult,
  type ModuleId,
  type UserProfile,
} from '@/lib/types'

const DEFAULT_PROFILE: UserProfile = {
  id: 'default-self',
  name: '',
  age: '',
  gender: '',
  relationship: 'self',
  bloodGroup: '',
  height: '',
  weight: '',
  bmi: '',
  bmiCategory: '',
  conditions: '',
  allergies: '',
  medications: '',
  emergencyContact: '',
}

interface DiagnosisState {
  // User profile & Multi-profile management
  userProfile: UserProfile
  savedProfiles: UserProfile[]
  setUserProfile: (profile: UserProfile) => void
  saveOrUpdateProfile: (profile: UserProfile) => void
  switchProfile: (id: string) => void
  deleteProfile: (id: string) => void

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

function buildEmpty<T>(value: T): Record<ModuleId, T> {
  return MODULES.reduce((acc, m) => {
    acc[m.id] = value
    return acc
  }, {} as Record<ModuleId, T>)
}

const emptyResults: Record<ModuleId, DiagnosisResult | null> = buildEmpty<DiagnosisResult | null>(null)
const emptyLoading: Record<ModuleId, boolean> = buildEmpty<boolean>(false)

export const useDiagnosisStore = create<DiagnosisState>()(
  persist(
    (set, get) => ({
      userProfile: { ...DEFAULT_PROFILE },
      savedProfiles: [{ ...DEFAULT_PROFILE, name: 'Primary Patient' }],

      setUserProfile: (profile) =>
        set((state) => {
          const profileWithId = {
            ...profile,
            id: profile.id || state.userProfile.id || `prof-${Date.now()}`,
          }
          const updatedSaved = state.savedProfiles.map((p) =>
            p.id === profileWithId.id ? profileWithId : p
          )
          if (!updatedSaved.some((p) => p.id === profileWithId.id)) {
            updatedSaved.push(profileWithId)
          }
          return {
            userProfile: profileWithId,
            savedProfiles: updatedSaved,
          }
        }),

      saveOrUpdateProfile: (profile) =>
        set((state) => {
          const profileWithId = {
            ...profile,
            id: profile.id || `prof-${Date.now()}`,
          }
          const exists = state.savedProfiles.some((p) => p.id === profileWithId.id)
          const newSaved = exists
            ? state.savedProfiles.map((p) => (p.id === profileWithId.id ? profileWithId : p))
            : [...state.savedProfiles, profileWithId]

          return {
            userProfile: profileWithId,
            savedProfiles: newSaved,
          }
        }),

      switchProfile: (id) =>
        set((state) => {
          const found = state.savedProfiles.find((p) => p.id === id)
          if (found) {
            return { userProfile: found }
          }
          return {}
        }),

      deleteProfile: (id) =>
        set((state) => {
          const filtered = state.savedProfiles.filter((p) => p.id !== id)
          const nextActive = filtered[0] || { ...DEFAULT_PROFILE }
          return {
            savedProfiles: filtered.length > 0 ? filtered : [{ ...DEFAULT_PROFILE }],
            userProfile: state.userProfile.id === id ? nextActive : state.userProfile,
          }
        }),

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
      name: 'nsvair-diagnosis-store',
      partialize: (state) => ({
        userProfile: state.userProfile,
        savedProfiles: state.savedProfiles,
        results: state.results,
        lastReport: state.lastReport,
      }),
    }
  )
)
