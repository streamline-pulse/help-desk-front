"use client"

import { IconDownload } from "@tabler/icons-react"

import { DataTableBulkDeleteButton } from "@/components/shared/core-table/table.bulk-delete"
import { useDataTableContext } from "@/components/shared/core-table/table.provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function DataTableSelectionActions<TRow, TFilters>({
  exportEnabled,
}: {
  exportEnabled: boolean
}) {
  const {
    selectedRows,
    clearSelection,
    bulkActions,
    bulkDeleteConfig,
    isExporting,
    runExport,
  } = useDataTableContext<TRow, TFilters>()

  const hasSelection = selectedRows.length > 0
  const showExport = exportEnabled
  const showDelete = Boolean(bulkDeleteConfig)
  const showCustomActions = Boolean(bulkActions)
  const isActive = hasSelection && (showExport || showDelete || showCustomActions)

  if (!showExport && !showDelete && !showCustomActions) return null

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 opacity-0 transition-opacity duration-200",
        isActive && "pointer-events-auto opacity-100"
      )}
      aria-hidden={!isActive}
    >
      <span className="text-sm font-medium tabular-nums">
        {selectedRows.length} ligne{selectedRows.length > 1 ? "s" : ""} sélectionnée
        {selectedRows.length > 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-1">
        {showCustomActions
          ? bulkActions?.({ selectedRows, clearSelection })
          : null}
        {showExport ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasSelection || isExporting}
            onClick={() => void runExport()}
          >
            {isExporting ? <Spinner /> : <IconDownload />}
            Exporter
          </Button>
        ) : null}
        {showDelete ? <DataTableBulkDeleteButton<TRow, TFilters> /> : null}
      </div>
    </div>
  )
}
