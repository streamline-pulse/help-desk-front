"use client"

import type { DataTableFilterOption } from "@/components/shared/data-table/data-table.types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectFilter({
  value,
  options,
  placeholder,
  disabled,
  onChange,
}: {
  value?: string
  options: readonly DataTableFilterOption[]
  placeholder?: string
  disabled?: boolean
  onChange: (value: string | undefined) => void
}) {
  const current = value || "__all__"
  return (
    <Select
      value={current}
      disabled={disabled}
      onValueChange={(next) =>
        onChange(!next || next === "__all__" ? undefined : next)
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {current === "__all__"
            ? (placeholder ?? "Toutes les valeurs")
            : (options.find((option) => option.value === current)?.label ?? current)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="__all__">{placeholder ?? "Toutes les valeurs"}</SelectItem>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
