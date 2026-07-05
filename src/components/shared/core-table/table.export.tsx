"use client"

import { IconDownload } from "@tabler/icons-react"

import { useDataTableContext } from "@/components/shared/core-table/table.provider"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"

export function DataTableExport<TRow, TFilters>() {
  const { isExporting, runExport } = useDataTableContext<TRow, TFilters>()
  return (
    <IconButton
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:text-foreground"
      disabled={isExporting}
      onClick={() => void runExport()}
      tooltip="Exporter les données"
    >
      {isExporting ? <Spinner /> : <IconDownload />}
    </IconButton>
  )
}
