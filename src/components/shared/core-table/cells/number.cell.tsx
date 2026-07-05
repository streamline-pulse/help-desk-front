"use client"

import { CellShell, CellTruncate } from "@/components/shared/core-table/cells/cell.utils"
import { cn } from "@/lib/utils"

export function NumberCell({
  value,
  suffix,
  fallback = "—",
  className,
}: {
  value?: number | null
  suffix?: string
  fallback?: string
  className?: string
}) {
  const isEmpty = value === null || value === undefined || Number.isNaN(value)
  const displayValue = isEmpty ? fallback : String(value)
  const alignEnd = !suffix

  return (
    <CellShell title={isEmpty ? undefined : `${displayValue}${suffix ? ` ${suffix}` : ""}`}>
      <div
        className={cn(
          "flex w-full min-w-0",
          alignEnd ? "justify-end" : "justify-start"
        )}
      >
        <CellTruncate
          className={cn(
            "text-sm tabular-nums text-foreground",
            isEmpty && "text-muted-foreground",
            className
          )}
        >
          {displayValue}
          {suffix && !isEmpty ? ` ${suffix}` : null}
        </CellTruncate>
      </div>
    </CellShell>
  )
}
