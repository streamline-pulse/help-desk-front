"use client"

import type { DataTableFilter as DataTableFilterDefinition } from "@/components/shared/core-table/table.types"
import { BooleanFilter } from "@/components/shared/core-table/filters/boolean.filter"
import { DateFilter } from "@/components/shared/core-table/filters/date-filter"
import {
  DateRangeFilter,
  type DateRangeFilterValue,
} from "@/components/shared/core-table/filters/date-range.filter"
import { MultiSelectFilter } from "@/components/shared/core-table/filters/multi-select.filter"
import {
  NumberRangeFilter,
  type NumberRangeFilterValue,
} from "@/components/shared/core-table/filters/number-range.filter"
import { SelectFilter } from "@/components/shared/core-table/filters/select.filter"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function DataTableFilter<TFilters>({
  filter,
  value,
  onChange,
}: {
  filter: DataTableFilterDefinition<TFilters>
  value: unknown
  onChange: (value: unknown) => void
}) {
  const control = (() => {
    if (filter.type === "text") {
      return (
        <Input
          value={typeof value === "string" ? value : ""}
          placeholder={filter.placeholder}
          disabled={filter.disabled}
          onChange={(event) => onChange(event.target.value || undefined)}
        />
      )
    }
    if (filter.type === "select") {
      return (
        <SelectFilter
          value={typeof value === "string" ? value : undefined}
          options={filter.options}
          placeholder={filter.placeholder}
          disabled={filter.disabled}
          onChange={onChange}
        />
      )
    }
    if (filter.type === "multi-select") {
      return (
        <MultiSelectFilter
          value={Array.isArray(value) ? value.map(String) : []}
          options={filter.options}
          disabled={filter.disabled}
          onChange={onChange}
        />
      )
    }
    if (filter.type === "boolean") {
      return (
        <BooleanFilter
          value={typeof value === "boolean" ? value : undefined}
          disabled={filter.disabled}
          onChange={onChange}
        />
      )
    }
    if (filter.type === "date") {
      return (
        <DateFilter
          value={typeof value === "string" ? value : undefined}
          disabled={filter.disabled}
          onChange={onChange}
        />
      )
    }
    if (filter.type === "date-range") {
      return (
        <DateRangeFilter
          value={(value as DateRangeFilterValue | undefined) ?? {}}
          disabled={filter.disabled}
          onChange={onChange}
        />
      )
    }
    if (filter.type === "number-range") {
      return (
        <NumberRangeFilter
          value={(value as NumberRangeFilterValue | undefined) ?? {}}
          disabled={filter.disabled}
          onChange={onChange}
        />
      )
    }
    return filter.render({
      value,
      setValue: onChange,
      clear: () => onChange(undefined),
      disabled: Boolean(filter.disabled),
    })
  })()

  return (
    <Field data-disabled={filter.disabled || undefined}>
      <FieldLabel>{filter.label}</FieldLabel>
      {control}
    </Field>
  )
}
