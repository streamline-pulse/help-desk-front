"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import {
  IconColumns3,
  IconDownload,
  IconFilter,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react"

import type { Employee } from "@/app/(board)/board/employees/_components/employee-mock-data"
import { InlineActiveFilters } from "@/app/(board)/board/employees/_components/table.active-filters"
import {
  columnLabels,
  departments,
} from "@/app/(board)/board/employees/_components/table.constants"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TableToolbarProps = {
  table: Table<Employee>
}

function exportSelectedRows(table: Table<Employee>) {
  const selectedEmployees = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original)

  if (selectedEmployees.length === 0) {
    return
  }

  const headers = Object.keys(selectedEmployees[0]) as (keyof Employee)[]
  const csvRows = [
    headers.join(","),
    ...selectedEmployees.map((employee) =>
      headers
        .map((header) => `"${String(employee[header]).replaceAll('"', '""')}"`)
        .join(",")
    ),
  ]
  const file = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8",
  })
  const downloadUrl = URL.createObjectURL(file)
  const link = document.createElement("a")

  link.href = downloadUrl
  link.download = "employes-selectionnes.csv"
  link.click()
  URL.revokeObjectURL(downloadUrl)
}

function FilterPopover({ table }: { table: Table<Employee> }) {
  const [open, setOpen] = useState(false)
  const departmentFilter =
    (table.getColumn("department")?.getFilterValue() as string) ?? "all"
  const employmentFilter =
    (table.getColumn("employment")?.getFilterValue() as string) ?? "all"
  const hasColumnFilters = table.getState().columnFilters.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Filtres"
          >
            <IconFilter />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-60 gap-3 p-3">
        <PopoverHeader>
          <PopoverTitle>Filtres</PopoverTitle>
        </PopoverHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="department-filter">Département</Label>
            <Select
              value={departmentFilter}
              onValueChange={(value) =>
                table
                  .getColumn("department")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger id="department-filter" className="w-full">
                <SelectValue>
                  {departmentFilter === "all"
                    ? "Tous les départements"
                    : departmentFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="employment-filter">Statut</Label>
            <Select
              value={employmentFilter}
              onValueChange={(value) =>
                table
                  .getColumn("employment")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger id="employment-filter" className="w-full">
                <SelectValue>
                  {employmentFilter === "all"
                    ? "Tous les statuts"
                    : employmentFilter === "Active"
                      ? "Actifs"
                      : "Inactifs"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Active">Actifs</SelectItem>
                <SelectItem value="Inactive">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasColumnFilters ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => table.resetColumnFilters()}
            >
              Réinitialiser les filtres
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ColumnsPopover({ table }: { table: Table<Employee> }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Colonnes visibles"
          >
            <IconColumns3 />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-52 gap-2 p-2">
        <PopoverHeader className="px-1">
          <PopoverTitle className="text-xs font-medium text-muted-foreground">
            Colonnes visibles
          </PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-0.5">
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              const columnId = column.id

              return (
                <label
                  key={columnId}
                  htmlFor={`column-${columnId}`}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-muted"
                >
                  <Checkbox
                    id={`column-${columnId}`}
                    checked={column.getIsVisible()}
                    onCheckedChange={(checked) =>
                      column.toggleVisibility(checked === true)
                    }
                  />
                  <span>{columnLabels[columnId] ?? columnId}</span>
                </label>
              )
            })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function TableToolbar({ table }: TableToolbarProps) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="space-y-3 px-6 pb-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-72 sm:shrink-0">
            <IconSearch
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={table.getState().globalFilter ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              placeholder="Rechercher un employé…"
              aria-label="Rechercher un employé"
              className="pl-8"
            />
          </div>
          <InlineActiveFilters table={table} />
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <FilterPopover table={table} />
          <ColumnsPopover table={table} />
          <Button
            size="sm"
            className="ml-1.5 h-7 gap-1 px-2.5 text-[13px]"
          >
            Ajouter
            <IconPlus data-icon="inline-end" />
          </Button>
        </div>
      </div>

      {selectedCount > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="text-sm font-medium tabular-nums">
            {selectedCount} employé{selectedCount > 1 ? "s" : ""} sélectionné
            {selectedCount > 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportSelectedRows(table)}
            >
              <IconDownload data-icon="inline-start" />
              Exporter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetRowSelection()}
            >
              Désélectionner
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
