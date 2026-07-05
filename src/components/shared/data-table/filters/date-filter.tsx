"use client"

import { Input } from "@/components/ui/input"

export function DateFilter({
  value,
  disabled,
  onChange,
}: {
  value?: string
  disabled?: boolean
  onChange: (value: string | undefined) => void
}) {
  return (
    <Input
      type="date"
      value={value ?? ""}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value || undefined)}
    />
  )
}
