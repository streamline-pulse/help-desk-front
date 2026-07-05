"use client"

import { useCallback, useState } from "react"

export function useTableDetail<TRow>() {
  const [item, setItem] = useState<TRow | null>(null)

  const openDetail = useCallback((row: TRow) => {
    setItem(row)
  }, [])

  const closeDetail = useCallback(() => {
    setItem(null)
  }, [])

  const onOpenChange = useCallback((open: boolean) => {
    if (!open) setItem(null)
  }, [])

  return {
    item,
    open: item !== null,
    openDetail,
    closeDetail,
    onOpenChange,
    setItem,
  }
}
