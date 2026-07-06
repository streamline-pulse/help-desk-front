"use client"

import { useMemo } from "react"

import { useCurrentGroup } from "@/hooks/use-current-group"

export function useActiveGroupContext() {
  const currentGroup = useCurrentGroup()

  const status = useMemo(() => {
    if (currentGroup.isPending || !currentGroup.hasHydrated) return "loading"
    if (!currentGroup.currentGroup?.id) return "missing"
    return "ready"
  }, [
    currentGroup.currentGroup?.id,
    currentGroup.hasHydrated,
    currentGroup.isPending,
  ])

  return {
    ...currentGroup,
    status,
    groupId: currentGroup.currentGroup?.id ?? null,
  }
}
