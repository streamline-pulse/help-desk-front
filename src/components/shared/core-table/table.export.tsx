"use client"

import { IconDownload } from "@tabler/icons-react"

import { useDataTableContext } from "@/components/shared/core-table/table.provider"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"
import { emitOnboardingEvent, onboardingEvents } from "@/lib/onboarding-events"

export function DataTableExport<TRow, TFilters>() {
  const { isExporting, runExport } = useDataTableContext<TRow, TFilters>()
  return (
    <IconButton
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:text-foreground"
      data-onboarding="table-export"
      disabled={isExporting}
      onClick={async () => {
        await runExport()
        emitOnboardingEvent(onboardingEvents.exportCompleted)
      }}
      tooltip="Exporter les données"
    >
      {isExporting ? <Spinner /> : <IconDownload />}
    </IconButton>
  )
}
