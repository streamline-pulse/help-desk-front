"use client"

import { Input } from "@/components/ui/input"

export type DateRangeFilterValue = { from?: string; to?: string }

export function DateRangeFilter({
  value,
  disabled,
  onChange,
}: {
  value: DateRangeFilterValue
  disabled?: boolean
  onChange: (value: DateRangeFilterValue) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Input
        type="date"
        aria-label="Date de début"
        value={value.from ?? ""}
        disabled={disabled}
        onChange={(event) =>
          onChange({ ...value, from: event.target.value || undefined })
        }
      />
      <Input
        type="date"
        aria-label="Date de fin"
        value={value.to ?? ""}
        disabled={disabled}
        onChange={(event) =>
          onChange({ ...value, to: event.target.value || undefined })
        }
      />
    </div>
  )
}
