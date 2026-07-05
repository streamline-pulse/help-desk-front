"use client"

import type { DataTableFilterOption } from "@/components/shared/core-table/table.types"
import { Checkbox } from "@/components/ui/checkbox"

export function MultiSelectFilter({
  value,
  options,
  disabled,
  onChange,
}: {
  value: string[]
  options: readonly DataTableFilterOption[]
  disabled?: boolean
  onChange: (value: string[]) => void
}) {
  return (
    <div className="flex max-h-48 flex-col gap-0.5 overflow-y-auto">
      {options.map((option) => {
        const checked = value.includes(option.value)
        return (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-muted has-disabled:cursor-not-allowed has-disabled:opacity-50"
          >
            <Checkbox
              checked={checked}
              disabled={disabled || option.disabled}
              onCheckedChange={(next) =>
                onChange(
                  next
                    ? [...value, option.value]
                    : value.filter((item) => item !== option.value)
                )
              }
            />
            <span>{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}
