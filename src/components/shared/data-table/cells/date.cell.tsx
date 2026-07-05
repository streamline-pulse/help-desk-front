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
  fallback = "—",
  relativeUntilDays = 0,
}: {
  value?: string | number | Date | null
  formatPattern?: string
  fallback?: string
  relativeUntilDays?: number
}) {
  const date = parseDate(value)
  if (!date || !isValid(date)) {
    return <span className="tabular-nums">{fallback}</span>
  }

  const exactDate = format(date, formatPattern, { locale: fr })
  const isRecent =
    relativeUntilDays > 0 &&
    Math.abs(differenceInMilliseconds(new Date(), date)) <=
      relativeUntilDays * DAY_IN_MILLISECONDS

  if (!isRecent) {
    return (
      <time className="tabular-nums" dateTime={date.toISOString()}>
        {exactDate}
      </time>
    )
  }

  const relativeDate = formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: fr,
  })

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <time
            className="tabular-nums text-muted-foreground"
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
  )
}
