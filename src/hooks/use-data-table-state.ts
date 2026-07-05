"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { SortingState, VisibilityState } from "@tanstack/react-table"
import { parseAsString, useQueryStates } from "nuqs"

import type {
  DataTableColumn,
  DataTableFilter,
  DataTableState,
} from "@/components/shared/data-table/data-table.types"

type UseDataTableStateOptions<TRow, TFilters> = {
  id: string
  columns: readonly DataTableColumn<TRow>[]
  filters: readonly DataTableFilter<TFilters>[]
  defaultSorting?: { key: string; direction: "asc" | "desc" }
  defaultPageSize: number
  debounceMs: number
  serverSorting: boolean
  orderingParameter?: string
}

function columnId<TRow>(column: DataTableColumn<TRow>) {
  if (column.id) return column.id
  if ("accessorKey" in column && column.accessorKey) return String(column.accessorKey)
  return undefined
}

function isEmptyFilterValue(value: unknown) {
  if (value === undefined || value === null || value === "") return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "object") {
    return Object.values(value).every(
      (item) => item === undefined || item === null || item === ""
    )
  }
  return false
}

function parseFilterValue<TFilters>(
  filter: DataTableFilter<TFilters>,
  value: string | null
): unknown {
  if (!value) return undefined
  if (filter.type === "multi-select") return value.split(",").filter(Boolean)
  if (filter.type === "boolean") return value === "true"
  if (filter.type === "date-range") {
    const [from, to] = value.split("..")
    return { from: from || undefined, to: to || undefined }
  }
  if (filter.type === "number-range") {
    const [minimum, maximum] = value.split("..")
    return {
      min: minimum ? Number(minimum) : undefined,
      max: maximum ? Number(maximum) : undefined,
    }
  }
  if (filter.type === "custom" && filter.parse) return filter.parse(value)
  return value
}

function formatFilterValue<TFilters>(
  filter: DataTableFilter<TFilters>,
  value: unknown
) {
  if (isEmptyFilterValue(value)) return null
  if (filter.type === "multi-select" && Array.isArray(value)) {
    return value.join(",") || null
  }
  if (filter.type === "date-range" && typeof value === "object" && value) {
    const range = value as { from?: string; to?: string }
    return `${range.from ?? ""}..${range.to ?? ""}`
  }
  if (filter.type === "number-range" && typeof value === "object" && value) {
    const range = value as { min?: number; max?: number }
    return `${range.min ?? ""}..${range.max ?? ""}`
  }
  if (filter.type === "custom" && filter.format) return filter.format(value)
  return String(value)
}

export function useDataTableState<TRow, TFilters>({
  id,
  columns,
  filters: filterDefinitions,
  defaultSorting,
  defaultPageSize,
  debounceMs,
  serverSorting,
  orderingParameter,
}: UseDataTableStateOptions<TRow, TFilters>): DataTableState<TFilters> {
  const keys = useMemo(
    () => ({
      page: `${id}_page`,
      pageSize: `${id}_pageSize`,
      search: `${id}_search`,
      ordering: `${id}_ordering`,
      filters: Object.fromEntries(
        filterDefinitions.map((filter) => [filter.key, `${id}_${filter.key}`])
      ) as Record<string, string>,
    }),
    [filterDefinitions, id]
  )
  const parsers = useMemo(() => {
    const parameterNames = [
      keys.page,
      keys.pageSize,
      keys.search,
      keys.ordering,
      ...Object.values(keys.filters),
    ]
    return Object.fromEntries(
      parameterNames.map((parameter) => [parameter, parseAsString])
    ) as Record<string, typeof parseAsString>
  }, [keys])
  const [urlState, setUrlState] = useQueryStates(parsers, {
    history: "replace",
    shallow: true,
  })
  const page = Math.max(Number(urlState[keys.page]) || 1, 1)
  const pageSize = Math.max(
    Number(urlState[keys.pageSize]) || defaultPageSize,
    1
  )
  const urlSearch = urlState[keys.search] ?? ""
  const [searchDraft, setSearchDraft] = useState({
    source: urlSearch,
    value: urlSearch,
  })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const search = searchDraft.source === urlSearch ? searchDraft.value : urlSearch

  useEffect(() => {
    if (search === urlSearch) return
    const timeout = window.setTimeout(() => {
      void setUrlState({
        [keys.search]: search.trim() || null,
        [keys.page]: null,
      })
    }, debounceMs)
    return () => window.clearTimeout(timeout)
  }, [debounceMs, keys.page, keys.search, search, setUrlState, urlSearch])

  const filters = useMemo(
    () =>
      Object.fromEntries(
        filterDefinitions.map((filter) => [
          filter.key,
          parseFilterValue(filter, urlState[keys.filters[filter.key]] ?? null),
        ])
      ),
    [filterDefinitions, keys.filters, urlState]
  )

  const defaultOrdering = defaultSorting
    ? `${defaultSorting.direction === "desc" ? "-" : ""}${defaultSorting.key}`
    : ""
  const ordering = urlState[keys.ordering] ?? defaultOrdering
  const sorting = useMemo<SortingState>(() => {
    if (!ordering) return []
    const descending = ordering.startsWith("-")
    const serverKey = descending ? ordering.slice(1) : ordering
    const matchingColumn = columns.find(
      (column) =>
        column.serverKey === serverKey || columnId(column) === serverKey
    )
    const idValue = matchingColumn ? columnId(matchingColumn) : serverKey
    return idValue ? [{ id: idValue, desc: descending }] : []
  }, [columns, ordering])

  const setPage = useCallback(
    (nextPage: number) => {
      void setUrlState({ [keys.page]: nextPage > 1 ? String(nextPage) : null })
    },
    [keys.page, setUrlState]
  )
  const setPageSize = useCallback(
    (nextPageSize: number) => {
      void setUrlState({
        [keys.pageSize]:
          nextPageSize === defaultPageSize ? null : String(nextPageSize),
        [keys.page]: null,
      })
    },
    [defaultPageSize, keys.page, keys.pageSize, setUrlState]
  )
  const setSearch = useCallback(
    (nextSearch: string) =>
      setSearchDraft({ source: urlSearch, value: nextSearch }),
    [urlSearch]
  )
  const setFilter = useCallback(
    (key: string, value: unknown) => {
      const filter = filterDefinitions.find((item) => item.key === key)
      if (!filter) return
      void setUrlState({
        [keys.filters[key]]: formatFilterValue(filter, value),
        [keys.page]: null,
      })
    },
    [filterDefinitions, keys.filters, keys.page, setUrlState]
  )
  const clearFilter = useCallback(
    (key: string) => {
      const parameter = keys.filters[key]
      if (parameter) void setUrlState({ [parameter]: null, [keys.page]: null })
    },
    [keys.filters, keys.page, setUrlState]
  )
  const resetFilters = useCallback(() => {
    const update = Object.fromEntries(
      Object.values(keys.filters).map((parameter) => [parameter, null])
    )
    void setUrlState({ ...update, [keys.page]: null })
  }, [keys.filters, keys.page, setUrlState])
  const setSorting = useCallback(
    (nextSorting: SortingState) => {
      const next = nextSorting[0]
      if (!next) {
        void setUrlState({ [keys.ordering]: null, [keys.page]: null })
        return
      }
      const column = columns.find((item) => columnId(item) === next.id)
      const key = serverSorting ? column?.serverKey : next.id
      if (!key) return
      const nextOrdering = `${next.desc ? "-" : ""}${key}`
      void setUrlState({
        [keys.ordering]: nextOrdering === defaultOrdering ? null : nextOrdering,
        [keys.page]: null,
      })
    },
    [columns, defaultOrdering, keys.ordering, keys.page, serverSorting, setUrlState]
  )

  const requestFilters = useMemo(() => {
    const entries = filterDefinitions.flatMap((filter) => {
      const value = filters[filter.key]
      if (filter.hidden || filter.disabled || isEmptyFilterValue(value)) return []
      const serialized = filter.serialize
        ? filter.serialize(value)
        : filter.type === "date-range" ||
            filter.type === "number-range" ||
            filter.type === "custom"
          ? formatFilterValue(filter, value) ?? undefined
          : value
      if (isEmptyFilterValue(serialized)) return []
      return [[filter.key, serialized] as const]
    })
    return Object.fromEntries(entries) as DataTableState<TFilters>["request"]["filters"]
  }, [filterDefinitions, filters])

  return {
    page,
    pageSize,
    search,
    debouncedSearch: urlSearch,
    filters,
    sorting,
    columnVisibility,
    activeFilterCount: filterDefinitions.filter(
      (filter) =>
        !filter.hidden &&
        !filter.disabled &&
        !isEmptyFilterValue(filters[filter.key])
    ).length,
    request: {
      page,
      perPage: pageSize,
      search: urlSearch.trim() || undefined,
      filters: requestFilters,
      ordering: serverSorting ? ordering || undefined : undefined,
      orderingParameter: serverSorting ? orderingParameter : undefined,
    },
    setPage,
    setPageSize,
    setSearch,
    setFilter,
    clearFilter,
    resetFilters,
    setSorting,
    setColumnVisibility,
  }
}
