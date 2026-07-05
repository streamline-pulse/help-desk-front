"use client"

import { useDataTableContext } from "@/components/shared/data-table/data-table.provider"
import { Button } from "@/components/ui/button"

export function DataTableSelectionActions<TRow, TFilters>() {
  const { selectedRows, clearSelection, bulkActions } =
    useDataTableContext<TRow, TFilters>()
  if (selectedRows.length === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2">
      <span className="text-sm font-medium tabular-nums">
        {selectedRows.length} ligne{selectedRows.length > 1 ? "s" : ""} sélectionnée
        {selectedRows.length > 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-1">
        {bulkActions?.({ selectedRows, clearSelection })}
        <Button variant="ghost" size="sm" onClick={clearSelection}>
          Désélectionner
        </Button>
      </div>
    </div>
  )
}
