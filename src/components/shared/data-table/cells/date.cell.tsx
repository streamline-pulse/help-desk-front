import { format, isValid, parseISO } from "date-fns"

export function DateCell({
  value,
  formatPattern = "dd/MM/yyyy",
  fallback = "—",
}: {
  value?: string | Date | null
  formatPattern?: string
  fallback?: string
}) {
  const date = value instanceof Date ? value : value ? parseISO(value) : null
  return (
    <span className="tabular-nums">
      {date && isValid(date) ? format(date, formatPattern) : fallback}
    </span>
  )
}
