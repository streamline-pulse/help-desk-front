"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { IconCheck, IconX } from "@tabler/icons-react"

import type { Employee } from "@/app/(board)/board/employees/_components/employee-mock-data"
import { departments } from "@/app/(board)/board/employees/_components/table.constants"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type FilterOption = {
  value: string
  label: string
}

type InlineActiveFiltersProps = {
  table: Table<Employee>
}

function FilterChip({
  label,
  value,
  selectedValue,
  options,
  onSelect,
  onRemove,
}: {
  label: string
  value: string
  selectedValue: string
  options: FilterOption[]
  onSelect: (value: string) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(false)

  const handleSelect = (nextValue: string) => {
    onSelect(nextValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <span className="inline-flex h-7 shrink-0 items-center gap-0.5 rounded-full border bg-muted/40 pl-2 text-xs font-medium">
        <PopoverTrigger
          render={
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full py-1 pr-1 pl-0.5 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{label}</span>
              <span className="text-muted-foreground">{value}</span>
            </button>
          }
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="size-6 rounded-full text-muted-foreground hover:text-foreground"
          onClick={onRemove}
          aria-label={`Supprimer le filtre ${label}`}
        >
          <IconX />
        </Button>
      </span>
      <PopoverContent
        align="start"
        sideOffset={2}
        className="w-auto min-w-0 gap-0 rounded-md p-0.5 shadow-sm"
      >
        <div role="listbox" aria-label={label} className="flex flex-col">
          {options.map((option) => {
            const isSelected = selectedValue === option.value

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-[4px] px-2 py-1 text-left text-xs whitespace-nowrap outline-none hover:bg-muted focus-visible:bg-muted",
                  isSelected && "bg-muted/70 font-medium"
                )}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <IconCheck className="size-3 shrink-0 text-muted-foreground" />
                ) : (
                  <span className="size-3 shrink-0" aria-hidden />
                )}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const departmentOptions: FilterOption[] = [
  { value: "all", label: "Tous" },
  ...departments.map((department) => ({
    value: department,
    label: department,
  })),
]

const employmentOptions: FilterOption[] = [
  { value: "all", label: "Tous" },
  { value: "Active", label: "Actifs" },
  { value: "Inactive", label: "Inactifs" },
]

function DepartmentFilterChip({ table }: { table: Table<Employee> }) {
  const value = table.getColumn("department")?.getFilterValue() as
    | string
    | undefined

  if (!value) {
    return null
  }

  return (
    <FilterChip
      label="Département"
      value={value}
      selectedValue={value}
      options={departmentOptions}
      onSelect={(nextValue) =>
        table
          .getColumn("department")
          ?.setFilterValue(nextValue === "all" ? undefined : nextValue)
      }
      onRemove={() => table.getColumn("department")?.setFilterValue(undefined)}
    />
  )
}

function EmploymentFilterChip({ table }: { table: Table<Employee> }) {
  const rawValue = table.getColumn("employment")?.getFilterValue() as
    | string
    | undefined

  if (!rawValue) {
    return null
  }

  const displayValue = rawValue === "Active" ? "Actifs" : "Inactifs"

  return (
    <FilterChip
      label="Statut"
      value={displayValue}
      selectedValue={rawValue}
      options={employmentOptions}
      onSelect={(nextValue) =>
        table
          .getColumn("employment")
          ?.setFilterValue(nextValue === "all" ? undefined : nextValue)
      }
      onRemove={() => table.getColumn("employment")?.setFilterValue(undefined)}
    />
  )
}

export function InlineActiveFilters({ table }: InlineActiveFiltersProps) {
  return (
    <>
      <DepartmentFilterChip table={table} />
      <EmploymentFilterChip table={table} />
    </>
  )
}
