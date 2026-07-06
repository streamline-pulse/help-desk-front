"use client"

import { useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"

import { getGroupIdFromPathname } from "@/config/board-breadcrumbs"
import { useMyGroupListQuery } from "@/hooks/queries/use-group.query"
import { useCurrentGroupStore } from "@/stores/current-group.store"

const listRequest = { page: 1, perPage: 100, filters: {} }

export function useCurrentGroup() {
  const pathname = usePathname()
  const routeGroupId = getGroupIdFromPathname(pathname)
  const groupsQuery = useMyGroupListQuery(listRequest)
  const selectedGroupId = useCurrentGroupStore((state) => state.selectedGroupId)
  const setSelectedGroupId = useCurrentGroupStore(
    (state) => state.setSelectedGroupId
  )
  const hasHydrated = useCurrentGroupStore((state) => state.hasHydrated)

  const groups = useMemo(() => groupsQuery.data?.rows ?? [], [groupsQuery.data?.rows])

  useEffect(() => {
    if (!routeGroupId) return
    if (selectedGroupId === routeGroupId) return
    setSelectedGroupId(routeGroupId)
  }, [routeGroupId, selectedGroupId, setSelectedGroupId])

  useEffect(() => {
    if (!hasHydrated) return
    if (routeGroupId) return
    if (!groups.length) return

    const hasSelectedGroup =
      selectedGroupId != null && groups.some((group) => group.id === selectedGroupId)

    if (!hasSelectedGroup) {
      setSelectedGroupId(groups[0]?.id ?? null)
    }
  }, [groups, hasHydrated, routeGroupId, selectedGroupId, setSelectedGroupId])

  const currentGroup = useMemo(() => {
    const activeId = routeGroupId ?? selectedGroupId
    return groups.find((group) => group.id === activeId) ?? null
  }, [groups, routeGroupId, selectedGroupId])

  return {
    groups,
    currentGroup,
    selectedGroupId,
    setSelectedGroupId,
    routeGroupId,
    hasHydrated,
    isPending: groupsQuery.isPending,
    isError: groupsQuery.isError,
  }
}
