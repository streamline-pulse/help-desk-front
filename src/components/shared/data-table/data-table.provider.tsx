"use client"

import { createContext, useContext } from "react"

import type { DataTableController } from "@/components/shared/data-table/data-table.types"

const DataTableContext = createContext<unknown>(null)

export function DataTableProvider<TRow, TFilters>({
  controller,
  children,
}: {
  controller: DataTableController<TRow, TFilters>
  children: React.ReactNode
}) {
  return (
    <DataTableContext.Provider value={controller}>
      {children}
    </DataTableContext.Provider>
  )
}

export function useDataTableContext<TRow, TFilters>() {
  const context = useContext(DataTableContext)
  if (!context) {
    throw new Error("DataTable components must be used inside DataTableProvider")
  }
  return context as DataTableController<TRow, TFilters>
}
