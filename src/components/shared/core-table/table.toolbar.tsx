"use client"

import { IconFilter, IconSearch, IconX } from "@tabler/icons-react"

import { DataTableColumnVisibility } from "@/components/shared/core-table/table.column-visibility"
import { DataTableExport } from "@/components/shared/core-table/table.export"
import { useDataTableContext } from "@/components/shared/core-table/table.provider"
import { DataTableSelectionActions } from "@/components/shared/core-table/table.selection-actions"
import type { DataTableFilter } from "@/components/shared/core-table/table.types"
import { DataTableFilter as FilterControl } from "@/components/shared/core-table/filters/table.filter"
import { Button } from "@/components/ui/button"
import { IconButton, IconButtonTooltip } from "@/components/ui/icon-button"
import { FieldGroup } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function filterDisplayValue<TFilters>(
  filter: DataTableFilter<TFilters>,
  value: unknown
) {
  if (filter.type === "select" && typeof value === "string") {
    return filter.options.find((option) => option.value === value)?.label ?? value
  }
  if (filter.type === "multi-select" && Array.isArray(value)) {
    return value.length > 1 ? `${value.length} valeurs` : String(value[0] ?? "")
  }
  if (filter.type === "boolean") return value ? "Oui" : "Non"
  if (typeof value === "object" && value) {
    return Object.values(value).filter(Boolean).join(" – ")
  }
  return String(value ?? "")
}

function ActiveFilters<TRow, TFilters>() {
  const { filters, state } = useDataTableContext<TRow, TFilters>()
  return filters.map((filter) => {
    const value = state.filters[filter.key]
    if (
      filter.hidden ||
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return null
    }
    return (
      <span
        key={filter.key}
        className="inline-flex h-7 shrink-0 items-center gap-0.5 rounded-full border bg-muted/40 pl-2 text-xs font-medium"
      >
        <span>{filter.label}</span>
        <span className="ml-1 text-muted-foreground">
          {filterDisplayValue(filter, value)}
        </span>
        <IconButton
          variant="ghost"
          size="icon-xs"
          className="size-6 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => state.clearFilter(filter.key)}
          tooltip={`Supprimer le filtre ${filter.label}`}
        >
          <IconX />
        </IconButton>
      </span>
    )
  })
}

function FiltersPopover<TRow, TFilters>() {
  const { filters, state } = useDataTableContext<TRow, TFilters>()
  const visibleFilters = filters.filter((filter) => !filter.hidden)
  if (visibleFilters.length === 0) return null

  return (
    <Popover>
      <IconButtonTooltip
        label={`Filtres${state.activeFilterCount ? ` (${state.activeFilterCount} actifs)` : ""}`}
      >
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative text-muted-foreground hover:text-foreground"
              aria-label={`Filtres${state.activeFilterCount ? ` (${state.activeFilterCount} actifs)` : ""}`}
            >
              <IconFilter />
              {state.activeFilterCount > 0 ? (
                <span className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground tabular-nums">
                  {state.activeFilterCount}
                </span>
              ) : null}
            </Button>
          }
        />
      </IconButtonTooltip>
      <PopoverContent align="end" className="w-72 gap-3 p-3">
        <PopoverHeader>
          <PopoverTitle>Filtres</PopoverTitle>
        </PopoverHeader>
        <FieldGroup>
          {visibleFilters.map((filter) => (
            <FilterControl
              key={filter.key}
              filter={filter}
              value={state.filters[filter.key]}
              onChange={(value) => state.setFilter(filter.key, value)}
            />
          ))}
        </FieldGroup>
        {state.activeFilterCount > 0 ? (
          <Button variant="outline" size="sm" onClick={state.resetFilters}>
            Réinitialiser les filtres
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export function DataTableToolbar<TRow, TFilters>({
  exportEnabled,
}: {
  exportEnabled: boolean
}) {
  const { state, searchConfig, toolbarActions, selectedRows } =
    useDataTableContext<TRow, TFilters>()
  const searchEnabled = searchConfig?.enabled !== false
  const hasSelection = selectedRows.length > 0

  return (
    <div className="px-6 pb-3">
      <div className="relative">
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 transition-opacity duration-200",
            hasSelection && "invisible"
          )}
          aria-hidden={hasSelection}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {searchEnabled ? (
              <InputGroup className="w-full sm:w-72 sm:shrink-0">
                <InputGroupAddon>
                  <IconSearch aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  value={state.search}
                  onChange={(event) => state.setSearch(event.target.value)}
                  placeholder={searchConfig?.placeholder ?? "Rechercher…"}
                  aria-label={searchConfig?.placeholder ?? "Rechercher"}
                />
              </InputGroup>
            ) : null}
            <ActiveFilters<TRow, TFilters> />
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <FiltersPopover<TRow, TFilters> />
            <DataTableColumnVisibility<TRow, TFilters> />
            {exportEnabled ? <DataTableExport<TRow, TFilters> /> : null}
            {toolbarActions}
          </div>
        </div>
        <DataTableSelectionActions<TRow, TFilters> exportEnabled={exportEnabled} />
      </div>
    </div>
  )
}
