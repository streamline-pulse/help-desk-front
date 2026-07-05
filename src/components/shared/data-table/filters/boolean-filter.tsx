"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BooleanFilter({
  value,
  disabled,
  onChange,
}: {
  value?: boolean
  disabled?: boolean
  onChange: (value: boolean | undefined) => void
}) {
  const current = value === undefined ? "all" : String(value)
  return (
    <Select
      value={current}
      disabled={disabled}
      onValueChange={(next) =>
        onChange(!next || next === "all" ? undefined : next === "true")
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {current === "all" ? "Tous" : current === "true" ? "Oui" : "Non"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="true">Oui</SelectItem>
          <SelectItem value="false">Non</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
