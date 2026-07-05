"use client"

import { createElement, useEffect, useMemo, useState } from "react"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table"

import type {
  DataTableBulkActions,
  DataTableBulkDeleteConfig,
  DataTableColumn,
  DataTableController,
  DataTableExportConfig,
  DataTableFilter,
  DataTableRowInteraction,
  DataTableSearchConfig,
  DataTableSlots,
  DataTableState,
  NormalizedApiError,
} from "@/components/shared/core-table/table.types"
import { exportTableToCsv } from "@/components/shared/core-table/table.export.utils"
import { Checkbox } from "@/components/ui/checkbox"

type UseDataTableOptions<TRow, TFilters> = {
  mode: "client" | "server"
  sourceRows: TRow[]
  total: number
  pageCount: number
  state: DataTableState<TFilters>
  columns: readonly DataTableColumn<TRow>[]
  filters: readonly DataTableFilter<TFilters>[]
  getRowId: (row: TRow) => string
  selectable: boolean
  rowActions?: (row: TRow) => React.ReactNode
  rowInteraction?: DataTableRowInteraction<TRow>
  searchConfig?: DataTableSearchConfig
  pageSizeOptions: readonly number[]
  toolbarActions?: React.ReactNode
  bulkActions?: DataTableBulkActions<TRow>
  bulkDeleteConfig?: DataTableBulkDeleteConfig<TRow>
  exportConfig?: DataTableExportConfig<TRow, TFilters>
  beforeTable?: React.ReactNode
  slots?: DataTableSlots
  ariaLabel: string
  isInitialLoading: boolean
  isRefetching: boolean
  error: NormalizedApiError | null
  retry: () => void
  sortingEnabled: boolean
}

function resolveUpdater<T>(updater: Updater<T>, current: T) {
  return typeof updater === "function"
    ? (updater as (value: T) => T)(current)
    : updater
}

function getProperty(row: unknown, key: string) {
  if (typeof row !== "object" || row === null) return undefined
  return (row as Record<string, unknown>)[key]
}

function matchesFilter<TFilters>(
  row: unknown,
  filter: DataTableFilter<TFilters>,
  value: unknown
) {
  if (filter.clientPredicate) return filter.clientPredicate(row, value)
  const rowValue = getProperty(row, filter.key)

  if (filter.type === "text") {
    return String(rowValue ?? "").toLowerCase().includes(String(value).toLowerCase())
  }
  if (filter.type === "multi-select" && Array.isArray(value)) {
    return value.map(String).includes(String(rowValue))
  }
  if (filter.type === "boolean") return Boolean(rowValue) === value
  if (filter.type === "date") return String(rowValue).slice(0, 10) === value
  if (filter.type === "date-range" && typeof value === "object" && value) {
    const range = value as { from?: string; to?: string }
    const current = String(rowValue ?? "").slice(0, 10)
    return (!range.from || current >= range.from) && (!range.to || current <= range.to)
  }
  if (filter.type === "number-range" && typeof value === "object" && value) {
    const range = value as { min?: number; max?: number }
    const current = Number(rowValue)
    return (
      Number.isFinite(current) &&
      (range.min === undefined || current >= range.min) &&
      (range.max === undefined || current <= range.max)
    )
  }
  if (filter.type === "custom") return true
  return String(rowValue) === String(value)
}

function filterClientRows<TRow, TFilters>(
  rows: TRow[],
  search: string,
  filters: readonly DataTableFilter<TFilters>[],
  values: Record<string, unknown>
) {
  const normalizedSearch = search.trim().toLowerCase()
  return rows.filter((row) => {
    if (
      normalizedSearch &&
      !JSON.stringify(row).toLowerCase().includes(normalizedSearch)
    ) {
      return false
    }
    return filters.every((filter) => {
      if (filter.hidden || filter.disabled) return true
      const value = values[filter.key]
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return true
      }
      return matchesFilter(row, filter, value)
    })
  })
}

export function useDataTable<TRow, TFilters>({
  mode,
  sourceRows,
  total,
  pageCount,
  state,
  columns,
  filters,
  getRowId,
  selectable,
  rowActions,
  rowInteraction,
  searchConfig,
  pageSizeOptions,
  toolbarActions,
  bulkActions,
  bulkDeleteConfig,
  exportConfig,
  beforeTable,
  slots,
  ariaLabel,
  isInitialLoading,
  isRefetching,
  error,
  retry,
  sortingEnabled,
}: UseDataTableOptions<TRow, TFilters>): DataTableController<TRow, TFilters> {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isExporting, setIsExporting] = useState(false)
  const criteriaSignature = JSON.stringify(state.request)

  useEffect(() => {
    if (mode === "server") setRowSelection({})
  }, [criteriaSignature, mode])

  const clientRows = useMemo(
    () =>
      mode === "client"
        ? filterClientRows(
            sourceRows,
            state.debouncedSearch,
            filters,
            state.filters
          )
        : sourceRows,
    [filters, mode, sourceRows, state.debouncedSearch, state.filters]
  )
  const tableColumns = useMemo<ColumnDef<TRow>[]>(() => {
    const normalized: ColumnDef<TRow>[] = columns.map((column) => ({
      ...column,
      enableSorting:
        sortingEnabled && (column.sortable ?? column.enableSorting ?? false),
      enableHiding: column.hideable ?? column.enableHiding ?? true,
      meta: {
        ...(column.meta ?? {}),
        serverKey: column.serverKey,
        label: column.label,
        className: column.className,
        headerClassName: column.headerClassName,
        exportable: column.exportable,
        exportValue: column.exportValue,
      },
    }))

    if (selectable) {
      normalized.unshift({
        id: "select",
        header: ({ table }) =>
          createElement(Checkbox, {
            checked: table.getIsAllPageRowsSelected(),
            indeterminate:
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected(),
            onCheckedChange: (checked) =>
              table.toggleAllPageRowsSelected(Boolean(checked)),
            "aria-label": "Sélectionner toutes les lignes de cette page",
          }),
        cell: ({ row }) =>
          createElement(Checkbox, {
            checked: row.getIsSelected(),
            onCheckedChange: (checked) => row.toggleSelected(Boolean(checked)),
            "aria-label": `Sélectionner la ligne ${row.id}`,
          }),
        enableSorting: false,
        enableHiding: false,
      })
    }
    if (rowActions) {
      normalized.push({
        id: "actions",
        header: () => null,
        cell: ({ row }) => rowActions(row.original),
        enableSorting: false,
        enableHiding: false,
      })
    }
    return normalized
  }, [columns, rowActions, selectable, sortingEnabled])
  const pagination: PaginationState = {
    pageIndex: state.page - 1,
    pageSize: state.pageSize,
  }

  // TanStack Table exposes stateful callbacks that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: clientRows,
    columns: tableColumns,
    state: {
      pagination,
      sorting: state.sorting,
      columnVisibility: state.columnVisibility,
      rowSelection,
    },
    getRowId,
    enableRowSelection: selectable,
    manualPagination: mode === "server",
    manualSorting: mode === "server",
    pageCount: mode === "server" ? pageCount : undefined,
    onPaginationChange: (updater) => {
      const next = resolveUpdater(updater, pagination)
      if (next.pageSize !== state.pageSize) state.setPageSize(next.pageSize)
      else state.setPage(next.pageIndex + 1)
    },
    onSortingChange: (updater) =>
      state.setSorting(resolveUpdater<SortingState>(updater, state.sorting)),
    onColumnVisibilityChange: state.setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: mode === "client" ? getPaginationRowModel() : undefined,
  })
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)
  const clearSelection = () => table.resetRowSelection()
  const runExport = async () => {
    if (!exportConfig?.enabled || isExporting) return
    setIsExporting(true)
    try {
      const rows =
        selectedRows.length > 0
          ? selectedRows
          : table.getRowModel().rows.map((row) => row.original)

      if (exportConfig.handler) {
        await exportConfig.handler({
          request: state.request,
          visibleRows: table.getRowModel().rows.map((row) => row.original),
          selectedRows,
          clearSelection,
        })
        return
      }

      if (exportConfig.filename) {
        exportTableToCsv({
          table,
          rows,
          filename: exportConfig.filename,
        })
      }
    } finally {
      setIsExporting(false)
    }
  }

  return {
    table,
    state,
    rows: clientRows,
    total: mode === "client" ? clientRows.length : total,
    pageCount: mode === "client" ? table.getPageCount() : pageCount,
    isInitialLoading,
    isRefetching,
    error,
    retry,
    hasActiveCriteria:
      Boolean(state.debouncedSearch) || state.activeFilterCount > 0,
    isExporting,
    runExport,
    selectedRows,
    clearSelection,
    filters,
    columns,
    searchConfig,
    pageSizeOptions,
    toolbarActions,
    bulkActions,
    bulkDeleteConfig,
    rowInteraction,
    beforeTable,
    slots,
    ariaLabel,
  }
}
