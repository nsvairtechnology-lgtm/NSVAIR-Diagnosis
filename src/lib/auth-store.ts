'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  authType: 'mobile' | 'gmail'
  identifier: string // phone number or gmail address
  email?: string
  mobileNumber?: string
  isVerified: boolean
  verifiedAt: string
  avatarUrl?: string
}

interface AuthState {
  currentUser: AuthUser | null
  isAuthModalOpen: boolean
  authModalReason: string // 'report' | 'download' | 'whatsapp' | 'gmail' | 'general'
  pendingActionCallback: (() => void) | null

  // UI state
  openAuthModal: (reason?: string, onVerified?: () => void) => void
  closeAuthModal: () => void

  // Auth actions
  loginWithMobile: (phone: string, name: string, otp: string) => { success: boolean; error?: string }
  loginWithGmail: (email: string, name: string, otp?: string) => { success: boolean; error?: string }
  logout: () => void
  updateUserProfileName: (name: string) => void
}

/**
 * Strict validator: ONLY @gmail.com or @googlemail.com allowed.
 * Custom domains, yahoo, outlook, disposable mails are rejected.
 */
export function isVerifiedGmailDomain(email: string): boolean {
  if (!email) return false
  const clean = email.trim().toLowerCase()
  // Must match user@gmail.com or user@googlemail.com
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com)$/
  return gmailRegex.test(clean)
}

/**
 * Clean mobile phone validator (10 to 15 digits)
 */
export function isValidMobileNumber(phone: string): boolean {
  const clean = phone.replace(/[^0-9]/g, '')
  return clean.length >= 10 && clean.length <= 15
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthModalOpen: false,
      authModalReason: 'general',
      pendingActionCallback: null,

      openAuthModal: (reason = 'report', onVerified) => {
        set({
          isAuthModalOpen: true,
          authModalReason: reason,
          pendingActionCallback: onVerified || null,
        })
      },

      closeAuthModal: () => {
        set({ isAuthModalOpen: false, pendingActionCallback: null })
      },

      loginWithMobile: (phone: string, name: string, otp: string) => {
        if (!isValidMobileNumber(phone)) {
          return { success: false, error: 'Please enter a valid 10-digit mobile number.' }
        }
        if (!otp || otp.trim().length !== 6) {
          return { success: false, error: 'Please enter the 6-digit verification OTP.' }
        }

        const user: AuthUser = {
          id: `usr_mob_${Date.now()}`,
          name: name.trim() || `Patient (${phone.slice(-4)})`,
          authType: 'mobile',
          identifier: phone.trim(),
          mobileNumber: phone.trim(),
          isVerified: true,
          verifiedAt: new Date().toISOString(),
        }

        set({
          currentUser: user,
          isAuthModalOpen: false,
        })

        const cb = get().pendingActionCallback
        if (cb) {
          cb()
          set({ pendingActionCallback: null })
        }

        return { success: true }
      },

      loginWithGmail: (email: string, name: string) => {
        const cleanEmail = email.trim().toLowerCase()
        if (!isVerifiedGmailDomain(cleanEmail)) {
          return {
            success: false,
            error: 'Custom domain emails not accepted. Only verified @gmail.com accounts are permitted.',
          }
        }

        const defaultName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ')
        const user: AuthUser = {
          id: `usr_gml_${Date.now()}`,
          name: name.trim() || defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
          authType: 'gmail',
          identifier: cleanEmail,
          email: cleanEmail,
          isVerified: true,
          verifiedAt: new Date().toISOString(),
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || defaultName)}&backgroundColor=059669`,
        }

        set({
          currentUser: user,
          isAuthModalOpen: false,
        })

        const cb = get().pendingActionCallback
        if (cb) {
          cb()
          set({ pendingActionCallback: null })
        }

        return { success: true }
      },

      logout: () => {
        set({ currentUser: null, isAuthModalOpen: false, pendingActionCallback: null })
      },

      updateUserProfileName: (name: string) => {
        const current = get().currentUser
        if (current) {
          set({ currentUser: { ...current, name } })
        }
      },
    }),
    {
      name: 'nsvair-auth-session',
    }
  )
)
