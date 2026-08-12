'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  type FullCalibrationCertificate,
  type DeviceProfile,
  detectDeviceProfile,
  runCompleteAutoCalibration,
  runSpeakerAudioTest,
} from '@/lib/calibration-engine'

interface CalibrationState {
  isCalibrated: boolean
  isCalibrating: boolean
  calibrationModalOpen: boolean
  deviceProfile: DeviceProfile
  activeCertificate: FullCalibrationCertificate | null
  lastCalibratedAt: string | null

  // Actions
  setModalOpen: (open: boolean) => void
  openCalibrationModal: () => void
  closeCalibrationModal: () => void
  runAutoCalibration: () => Promise<FullCalibrationCertificate>
  refreshDeviceProfile: () => void
  resetCalibration: () => void
}

export const useCalibrationStore = create<CalibrationState>()(
  persist(
    (set, get) => ({
      isCalibrated: false,
      isCalibrating: false,
      calibrationModalOpen: false,
      deviceProfile: detectDeviceProfile(),
      activeCertificate: null,
      lastCalibratedAt: null,

      setModalOpen: (open) => set({ calibrationModalOpen: open }),
      openCalibrationModal: () => set({ calibrationModalOpen: true }),
      closeCalibrationModal: () => set({ calibrationModalOpen: false }),

      refreshDeviceProfile: () => {
        set({ deviceProfile: detectDeviceProfile() })
      },

      runAutoCalibration: async () => {
        set({ isCalibrating: true })
        // Play acoustic test tone
        await runSpeakerAudioTest()
        // Simulate real-time sensor sampling for 1.8s
        await new Promise((resolve) => setTimeout(resolve, 1800))

        const certificate = await runCompleteAutoCalibration()

        set({
          isCalibrated: true,
          isCalibrating: false,
          activeCertificate: certificate,
          lastCalibratedAt: certificate.timestamp,
        })

        return certificate
      },

      resetCalibration: () => {
        set({
          isCalibrated: false,
          activeCertificate: null,
          lastCalibratedAt: null,
        })
      },
    }),
    {
      name: 'nsvair_device_calibration_v2',
      partialize: (state) => ({
        isCalibrated: state.isCalibrated,
        activeCertificate: state.activeCertificate,
        lastCalibratedAt: state.lastCalibratedAt,
      }),
    }
  )
)
