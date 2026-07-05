"use client"

import {
  differenceInMilliseconds,
  format,
  formatDistanceToNowStrict,
  isValid,
  parseISO,
} from "date-fns"
import { fr } from "date-fns/locale"

import {
  CellShell,
  CellTruncate,
  EMPTY_FALLBACK,
} from "@/components/shared/core-table/cells/cell.utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1_000

function parseDate(value?: string | number | Date | null) {
  if (value instanceof Date) return value
  if (typeof value === "number") {
    return new Date(value < 1_000_000_000_000 ? value * 1_000 : value)
  }
  return value ? parseISO(value) : null
}

export function DateCell({
  value,
  formatPattern = "dd/MM/yyyy HH:mm",
  fallback = EMPTY_FALLBACK,
  relativeUntilDays = 0,
}: {
  value?: string | number | Date | null
  formatPattern?: string
  fallback?: string
  relativeUntilDays?: number
}) {
  const date = parseDate(value)
  if (!date || !isValid(date)) {
    return (
      <CellShell>
        <CellTruncate className="text-sm tabular-nums text-muted-foreground">
          {fallback}
        </CellTruncate>
      </CellShell>
    )
  }

  const exactDate = format(date, formatPattern, { locale: fr })
  const isRecent =
    relativeUntilDays > 0 &&
    Math.abs(differenceInMilliseconds(new Date(), date)) <=
      relativeUntilDays * DAY_IN_MILLISECONDS

  if (!isRecent) {
    return (
      <CellShell title={exactDate}>
        <time
          className="block truncate text-sm tabular-nums text-foreground"
          dateTime={date.toISOString()}
        >
          {exactDate}
        </time>
      </CellShell>
    )
  }

  const relativeDate = formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: fr,
  })

  return (
    <CellShell title={exactDate}>
      <Tooltip>
        <TooltipTrigger
          render={
            <time
              className="block truncate text-sm tabular-nums text-muted-foreground"
              dateTime={date.toISOString()}
              tabIndex={0}
              suppressHydrationWarning
            />
          }
        >
          {relativeDate}
        </TooltipTrigger>
        <TooltipContent side="bottom">{exactDate}</TooltipContent>
      </Tooltip>
    </CellShell>
  )
}
