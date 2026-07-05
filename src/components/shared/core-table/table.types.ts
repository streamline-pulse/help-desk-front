import type { ReactNode } from "react"
import type {
  ColumnDef,
  SortingState,
  Table,
  VisibilityState,
} from "@tanstack/react-table"
import type {
  ApiListParams,
  ApiListParamValue,
  ApiPagedResponse,
  PageResult,
} from "@/types/api/api-data.type"
import type { NormalizedApiError } from "@/types/api/api-error.type"

import type { DeleteConfirmationLevel } from "@/components/shared/delete-confirmation.modal"

export type { ApiPagedResponse, NormalizedApiError, PageResult }
export type DataTableParamValue = ApiListParamValue

export type DataTableRequest<TFilters> = ApiListParams<TFilters> & {
  filters: NonNullable<ApiListParams<TFilters>["filters"]>
  ordering?: string
  orderingParameter?: string
}

export type DataTableQueryResult<TResponse> = {
  data?: TResponse
  error: unknown
  isPending: boolean
  isFetching: boolean
  refetch: () => Promise<unknown>
}

export type DataTableQueryHook<TResponse, TFilters> = (
  request: DataTableRequest<TFilters>
) => DataTableQueryResult<TResponse>

export type DataTableColumnMeta = {
  serverKey?: string
  label?: string
  className?: string
  headerClassName?: string
  hideable?: boolean
  exportable?: boolean
}

export type DataTableColumn<TRow, TValue = unknown> = ColumnDef<TRow, TValue> &
  DataTableColumnMeta & {
    sortable?: boolean
    exportValue?: (row: TRow) => string
  }

export type DataTableFilterOption = {
  value: string
  label: string
  disabled?: boolean
}

type DataTableFilterBase<TFilters> = {
  key: Extract<keyof TFilters, string>
  label: string
  placeholder?: string
  disabled?: boolean
  hidden?: boolean
  serialize?: (value: unknown) => DataTableParamValue | undefined
  clientPredicate?: (row: unknown, value: unknown) => boolean
}

export type DataTableCustomFilterContext = {
  value: unknown
  setValue: (value: unknown) => void
  clear: () => void
  disabled: boolean
}

export type DataTableFilter<TFilters> =
  | (DataTableFilterBase<TFilters> & { type: "text" })
  | (DataTableFilterBase<TFilters> & {
      type: "select"
      options: readonly DataTableFilterOption[]
    })
  | (DataTableFilterBase<TFilters> & {
      type: "multi-select"
      options: readonly DataTableFilterOption[]
    })
  | (DataTableFilterBase<TFilters> & { type: "boolean" })
  | (DataTableFilterBase<TFilters> & { type: "date" })
  | (DataTableFilterBase<TFilters> & { type: "date-range" })
  | (DataTableFilterBase<TFilters> & { type: "number-range" })
  | (DataTableFilterBase<TFilters> & {
      type: "custom"
      parse?: (value: string) => unknown
      format?: (value: unknown) => string
      render: (context: DataTableCustomFilterContext) => ReactNode
    })

export type DataTableSearchConfig = {
  enabled?: boolean
  placeholder?: string
  debounceMs?: number
}

export type DataTableSortingConfig = {
  enabled: true
  parameter: string
}

export type DataTableCapabilities = {
  pagination?: boolean
  search?: boolean
  filters?: boolean
  serverSorting?: boolean
}

export type DataTableExportContext<TRow, TFilters> = {
  request: DataTableRequest<TFilters>
  visibleRows: TRow[]
  selectedRows: TRow[]
  clearSelection: () => void
}

export type DataTableExportConfig<TRow, TFilters> = {
  enabled: boolean
  filename?: string
  label?: string
  handler?: (context: DataTableExportContext<TRow, TFilters>) => Promise<void> | void
}

export type DataTableBulkDeleteConfig<TRow> = {
  onDelete: (rows: TRow[]) => void | Promise<void>
  level?: DeleteConfirmationLevel
  isPending?: boolean
  onReset?: () => void
}

export type DataTableSlots = {
  loading?: ReactNode
  error?: (error: NormalizedApiError, retry: () => void) => ReactNode
  empty?: ReactNode
  noResults?: ReactNode
}

export type DataTableBulkActions<TRow> = (context: {
  selectedRows: TRow[]
  clearSelection: () => void
}) => ReactNode

export type DataTableRowInteraction<TRow> = {
  onRowClick?: (row: TRow) => void
  clickable?: boolean
}

type DataTableCommonProps<TSource, TRow, TFilters> = {
  id: string
  columns: readonly DataTableColumn<TRow>[]
  filters?: readonly DataTableFilter<TFilters>[]
  getRowId: (row: TRow) => string
  mapData?: (rows: TSource[]) => TRow[]
  defaultSorting?: { key: string; direction: "asc" | "desc" }
  defaultPageSize?: number
  pageSizeOptions?: readonly number[]
  search?: DataTableSearchConfig
  selectable?: boolean
  rowActions?: (row: TRow) => ReactNode
  rowInteraction?: DataTableRowInteraction<TRow>
  toolbarActions?: ReactNode
  bulkActions?: DataTableBulkActions<TRow>
  bulkDelete?: DataTableBulkDeleteConfig<TRow>
  export?: DataTableExportConfig<TRow, TFilters>
  beforeTable?: ReactNode
  slots?: DataTableSlots
  ariaLabel?: string
}

export type DataTableClientProps<TSource, TRow, TFilters> =
  DataTableCommonProps<TSource, TRow, TFilters> & {
    mode: "client"
    data: readonly TSource[]
    query?: never
    responseAdapter?: never
    capabilities?: never
    sorting?: never
  }

export type DataTableServerProps<TSource, TRow, TFilters, TResponse> =
  DataTableCommonProps<TSource, TRow, TFilters> & {
    mode?: "server"
    data?: never
    query: DataTableQueryHook<TResponse, TFilters>
    responseAdapter?: (response: TResponse) => PageResult<TSource>
    capabilities?: DataTableCapabilities
    sorting?: DataTableSortingConfig
  }

export type DataTableProps<
  TSource,
  TRow = TSource,
  TFilters = Record<string, never>,
  TResponse = ApiPagedResponse<TSource>,
> =
  | DataTableClientProps<TSource, TRow, TFilters>
  | DataTableServerProps<TSource, TRow, TFilters, TResponse>

export type DataTableState<TFilters> = {
  page: number
  pageSize: number
  search: string
  debouncedSearch: string
  filters: Record<string, unknown>
  sorting: SortingState
  columnVisibility: VisibilityState
  activeFilterCount: number
  request: DataTableRequest<TFilters>
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSearch: (search: string) => void
  setFilter: (key: string, value: unknown) => void
  clearFilter: (key: string) => void
  resetFilters: () => void
  setSorting: (sorting: SortingState) => void
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>
}

export type DataTableController<TRow, TFilters> = {
  table: Table<TRow>
  state: DataTableState<TFilters>
  rows: TRow[]
  total: number
  pageCount: number
  isInitialLoading: boolean
  isRefetching: boolean
  error: NormalizedApiError | null
  retry: () => void
  hasActiveCriteria: boolean
  isExporting: boolean
  runExport: () => Promise<void>
  selectedRows: TRow[]
  clearSelection: () => void
  filters: readonly DataTableFilter<TFilters>[]
  columns: readonly DataTableColumn<TRow>[]
  searchConfig?: DataTableSearchConfig
  pageSizeOptions: readonly number[]
  toolbarActions?: ReactNode
  bulkActions?: DataTableBulkActions<TRow>
  bulkDeleteConfig?: DataTableBulkDeleteConfig<TRow>
  rowInteraction?: DataTableRowInteraction<TRow>
  beforeTable?: ReactNode
  slots?: DataTableSlots
  ariaLabel: string
}
