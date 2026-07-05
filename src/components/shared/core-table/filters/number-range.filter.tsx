"use client"

import { Input } from "@/components/ui/input"

export type NumberRangeFilterValue = { min?: number; max?: number }

export function NumberRangeFilter({
  value,
  disabled,
  onChange,
}: {
  value: NumberRangeFilterValue
  disabled?: boolean
  onChange: (value: NumberRangeFilterValue) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Input
        type="number"
        aria-label="Valeur minimale"
        placeholder="Minimum"
        value={value.min ?? ""}
        disabled={disabled}
        onChange={(event) =>
          onChange({
            ...value,
            min: event.target.value ? Number(event.target.value) : undefined,
          })
        }
      />
      <Input
        type="number"
        aria-label="Valeur maximale"
        placeholder="Maximum"
        value={value.max ?? ""}
        disabled={disabled}
        onChange={(event) =>
          onChange({
            ...value,
            max: event.target.value ? Number(event.target.value) : undefined,
          })
        }
      />
    </div>
  )
}
