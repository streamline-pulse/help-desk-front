"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type CurrentGroupStore = {
  selectedGroupId: string | null
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  setSelectedGroupId: (groupId: string | null) => void
}

export const useCurrentGroupStore = create<CurrentGroupStore>()(
  persist(
    (set) => ({
      selectedGroupId: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setSelectedGroupId: (groupId) => set({ selectedGroupId: groupId }),
    }),
    {
      name: "help-desk-current-group",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedGroupId: state.selectedGroupId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
