"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type UserOnboardingProgress = {
  completedStepIds: string[]
  dismissedStepIds: string[]
  flowDismissed: boolean
  focusedStepId: string | null
}

export const EMPTY_ONBOARDING_PROGRESS: UserOnboardingProgress = {
  completedStepIds: [],
  dismissedStepIds: [],
  flowDismissed: false,
  focusedStepId: null,
}

type OnboardingStore = {
  progressByUserId: Record<string, UserOnboardingProgress>
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  getProgress: (userId: string) => UserOnboardingProgress
  completeStep: (userId: string, stepId: string) => void
  dismissStep: (userId: string, stepId: string) => void
  dismissFlow: (userId: string) => void
  focusStep: (userId: string, stepId: string | null) => void
}

function getUserProgress(
  progressByUserId: Record<string, UserOnboardingProgress>,
  userId: string
) {
  return progressByUserId[userId] ?? EMPTY_ONBOARDING_PROGRESS
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      progressByUserId: {},
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      getProgress: (userId) => getUserProgress(get().progressByUserId, userId),
      completeStep: (userId, stepId) =>
        set((state) => {
          const current = getUserProgress(state.progressByUserId, userId)
          if (current.completedStepIds.includes(stepId)) {
            return state
          }

          return {
            progressByUserId: {
              ...state.progressByUserId,
              [userId]: {
                ...current,
                completedStepIds: [...current.completedStepIds, stepId],
                focusedStepId:
                  current.focusedStepId === stepId ? null : current.focusedStepId,
              },
            },
          }
        }),
      dismissStep: (userId, stepId) =>
        set((state) => {
          const current = getUserProgress(state.progressByUserId, userId)
          if (current.dismissedStepIds.includes(stepId)) {
            return state
          }

          return {
            progressByUserId: {
              ...state.progressByUserId,
              [userId]: {
                ...current,
                dismissedStepIds: [...current.dismissedStepIds, stepId],
                focusedStepId:
                  current.focusedStepId === stepId ? null : current.focusedStepId,
              },
            },
          }
        }),
      dismissFlow: (userId) =>
        set((state) => {
          const current = getUserProgress(state.progressByUserId, userId)

          return {
            progressByUserId: {
              ...state.progressByUserId,
              [userId]: {
                ...current,
                flowDismissed: true,
                focusedStepId: null,
              },
            },
          }
        }),
      focusStep: (userId, stepId) =>
        set((state) => {
          const current = getUserProgress(state.progressByUserId, userId)

          return {
            progressByUserId: {
              ...state.progressByUserId,
              [userId]: {
                ...current,
                focusedStepId: stepId,
              },
            },
          }
        }),
    }),
    {
      name: "help-desk-onboarding",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ progressByUserId: state.progressByUserId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
