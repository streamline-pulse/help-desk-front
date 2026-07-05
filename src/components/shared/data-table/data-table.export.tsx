"use client"

import { IconDownload } from "@tabler/icons-react"

import { useDataTableContext } from "@/components/shared/data-table/data-table.provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function DataTableExport<TRow, TFilters>() {
  const { isExporting, runExport } = useDataTableContext<TRow, TFilters>()
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isExporting}
      onClick={() => void runExport()}
      aria-label="Exporter les données"
    >
      {isExporting ? <Spinner /> : <IconDownload />}
    </Button>
  )
}
