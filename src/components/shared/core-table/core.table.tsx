"use client"

import { useMemo } from "react"

import { DataTableBodyContent } from "@/components/shared/core-table/table.body"
import { DataTableHeader } from "@/components/shared/core-table/table.header"
import { DataTablePagination } from "@/components/shared/core-table/table.pagination"
import { DataTableProvider } from "@/components/shared/core-table/table.provider"
import { DataTableToolbar } from "@/components/shared/core-table/table.toolbar"
import type {
  ApiPagedResponse,
  DataTableClientProps,
  DataTableController,
  DataTableProps,
  DataTableServerProps,
} from "@/components/shared/core-table/table.types"
import { Spinner } from "@/components/ui/spinner"
import { Table } from "@/components/ui/table"
import { useDataTable } from "@/hooks/use-data-table"
import { useDataTableQuery } from "@/hooks/use-data-table-query"
import { useDataTableState } from "@/hooks/use-data-table-state"

function DataTableView<TRow, TFilters>({
  controller,
  exportEnabled,
}: {
  controller: DataTableController<TRow, TFilters>
  exportEnabled: boolean
}) {
  return (
    <DataTableProvider controller={controller}>
      <div className="pb-10">
        {controller.beforeTable}
        <DataTableToolbar<TRow, TFilters> exportEnabled={exportEnabled} />
        <div className="px-6">
          <div className="relative overflow-x-auto rounded-lg border">
            <Table
              aria-label={controller.ariaLabel}
              className="[&_td:not(:first-child)]:border-r [&_td:not(:first-child)]:border-border [&_td:last-child]:border-r-0 [&_th:not(:first-child)]:border-r [&_th:not(:first-child)]:border-border [&_th:last-child]:border-r-0"
            >
              <DataTableHeader<TRow, TFilters> />
              <DataTableBodyContent<TRow, TFilters> />
            </Table>
            {controller.isRefetching ? (
              <div className="absolute top-2 right-2 rounded-md bg-background/80 p-1 shadow-sm">
                <Spinner aria-label="Actualisation des données" />
              </div>
            ) : null}
          </div>
          <DataTablePagination<TRow, TFilters> />
        </div>
        <span className="sr-only" aria-live="polite">
          {controller.isInitialLoading
            ? "Chargement des données"
            : controller.isRefetching
              ? "Actualisation des données"
              : `${controller.total} résultats disponibles`}
        </span>
      </div>
    </DataTableProvider>
  )
}

function ClientDataTable<TSource, TRow, TFilters>({
  props,
}: {
  props: DataTableClientProps<TSource, TRow, TFilters>
}) {
  const { data, mapData } = props
  const filters = props.filters ?? []
  const defaultPageSize = props.defaultPageSize ?? 5
  const rows = useMemo(() => {
    const sourceRows = [...data]
    return mapData
      ? mapData(sourceRows)
      : (sourceRows as unknown as TRow[])
  }, [data, mapData])
  const state = useDataTableState({
    id: props.id,
    columns: props.columns,
    filters,
    defaultSorting: props.defaultSorting,
    defaultPageSize,
    debounceMs: props.search?.debounceMs ?? 400,
    serverSorting: false,
  })
  const controller = useDataTable({
    mode: "client",
    sourceRows: rows,
    total: rows.length,
    pageCount: 0,
    state,
    columns: props.columns,
    filters,
    getRowId: props.getRowId,
    selectable: props.selectable ?? Boolean(props.bulkActions ?? props.bulkDelete),
    rowActions: props.rowActions,
    rowInteraction: props.rowInteraction,
    searchConfig: props.search,
    pageSizeOptions: props.pageSizeOptions ?? [5, 10, 20],
    toolbarActions: props.toolbarActions,
    bulkActions: props.bulkActions,
    bulkDeleteConfig: props.bulkDelete,
    exportConfig: props.export,
    beforeTable: props.beforeTable,
    slots: props.slots,
    ariaLabel: props.ariaLabel ?? "Tableau de données",
    isInitialLoading: false,
    isRefetching: false,
    error: null,
    retry: () => undefined,
    sortingEnabled: true,
  })
  return (
    <DataTableView
      controller={controller}
      exportEnabled={Boolean(props.export?.enabled)}
    />
  )
}

function ServerDataTable<TSource, TRow, TFilters, TResponse>({
  props,
}: {
  props: DataTableServerProps<TSource, TRow, TFilters, TResponse>
}) {
  const capabilities = {
    pagination: props.capabilities?.pagination ?? true,
    search: props.capabilities?.search ?? true,
    filters: props.capabilities?.filters ?? true,
    serverSorting: props.capabilities?.serverSorting ?? false,
  }
  const filters = capabilities.filters ? (props.filters ?? []) : []
  const defaultPageSize = props.defaultPageSize ?? 50
  const serverSorting = capabilities.serverSorting && props.sorting?.enabled === true
  const state = useDataTableState({
    id: props.id,
    columns: props.columns,
    filters,
    defaultSorting: serverSorting ? props.defaultSorting : undefined,
    defaultPageSize,
    debounceMs: props.search?.debounceMs ?? 400,
    serverSorting,
    orderingParameter: serverSorting ? props.sorting?.parameter : undefined,
  })
  const query = useDataTableQuery({
    query: props.query,
    request: state.request,
    responseAdapter: props.responseAdapter,
    mapData: props.mapData,
  })
  const page = query.page ?? {
    rows: [],
    total: 0,
    page: state.page,
    pageSize: state.pageSize,
    pageCount: 0,
  }
  const searchConfig = capabilities.search
    ? props.search
    : { ...props.search, enabled: false }
  const controller = useDataTable({
    mode: "server",
    sourceRows: page.rows,
    total: page.total,
    pageCount: page.pageCount,
    state,
    columns: props.columns,
    filters,
    getRowId: props.getRowId,
    selectable: props.selectable ?? Boolean(props.bulkActions ?? props.bulkDelete),
    rowActions: props.rowActions,
    searchConfig,
    pageSizeOptions: props.pageSizeOptions ?? [10, 25, 50, 100],
    toolbarActions: props.toolbarActions,
    bulkActions: props.bulkActions,
    bulkDeleteConfig: props.bulkDelete,
    exportConfig: props.export,
    beforeTable: props.beforeTable,
    slots: props.slots,
    ariaLabel: props.ariaLabel ?? "Tableau de données",
    isInitialLoading: query.isInitialLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    retry: query.retry,
    sortingEnabled: serverSorting,
  })
  return (
    <DataTableView
      controller={controller}
      exportEnabled={Boolean(props.export?.enabled)}
    />
  )
}

export function DataTable<
  TSource,
  TRow = TSource,
  TFilters = Record<string, never>,
  TResponse = ApiPagedResponse<TSource>,
>(props: DataTableProps<TSource, TRow, TFilters, TResponse>) {
  if (props.mode === "client") return <ClientDataTable props={props} />
  return <ServerDataTable props={props} />
}
