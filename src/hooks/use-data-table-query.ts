"use client"

import { useMemo, useState } from "react"

import type {
  DataTableQueryHook,
  DataTableRequest,
} from "@/components/shared/data-table/data-table.types"
import { AppApiError } from "@/lib/api-error"
import { normalizePage } from "@/lib/api-response"
import type {
  ApiPagedResponse,
  PageResult,
} from "@/types/api/api-data.type"
import type { NormalizedApiError } from "@/types/api/api-error.type"

function normalizeTableError(error: unknown): NormalizedApiError | null {
  if (!error) return null
  if (error instanceof AppApiError) {
    return {
      httpStatus: error.httpStatus ?? error.status,
      code: error.code,
      message: error.message,
      data: error.data,
      kind: error.kind,
      cause: error.cause,
    }
  }
  if (error instanceof Error) {
    return { message: error.message, kind: "unknown", cause: error }
  }
  return {
    message: "Une erreur inattendue est survenue.",
    kind: "unknown",
    cause: error,
  }
}

type UseDataTableQueryOptions<TSource, TRow, TFilters, TResponse> = {
  query: DataTableQueryHook<TResponse, TFilters>
  request: DataTableRequest<TFilters>
  responseAdapter?: (response: TResponse) => PageResult<TSource>
  mapData?: (rows: TSource[]) => TRow[]
}

export function useDataTableQuery<TSource, TRow, TFilters, TResponse>({
  query,
  request,
  responseAdapter,
  mapData,
}: UseDataTableQueryOptions<TSource, TRow, TFilters, TResponse>) {
  const queryResult = query(request)
  const sourcePage = useMemo(() => {
    if (!queryResult.data) return null
    const adapted = responseAdapter
      ? responseAdapter(queryResult.data)
      : normalizePage(queryResult.data as ApiPagedResponse<TSource>)
    return {
      ...adapted,
      rows: mapData
        ? mapData(adapted.rows)
        : (adapted.rows as unknown as TRow[]),
    }
  }, [mapData, queryResult.data, responseAdapter])
  const [cachedPage, setCachedPage] = useState<PageResult<TRow> | null>(null)

  if (sourcePage && sourcePage !== cachedPage) setCachedPage(sourcePage)
  const page = sourcePage ?? cachedPage

  return {
    page,
    error: normalizeTableError(queryResult.error),
    isInitialLoading: queryResult.isPending && !page,
    isRefetching: queryResult.isFetching && Boolean(page),
    retry: () => void queryResult.refetch(),
  }
}
