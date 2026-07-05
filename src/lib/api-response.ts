import type {
  ApiEntityResponse,
  ApiMutationResult,
  ApiPagedResponse,
  PageResult,
} from "@/types/api/api-data.type"

export function normalizePage<T>(response: ApiPagedResponse<T>): PageResult<T> {
  return {
    rows: response.data ?? [],
    total: response.total ?? 0,
    page: Math.max(response.page ?? 1, 1),
    pageSize: Math.max(response.perPage ?? 50, 1),
    pageCount: Math.max(response.pages ?? 0, 0),
  }
}

export function normalizeEntity<T>(response: ApiEntityResponse<T>): T | null {
  return response.data ?? null
}

export function normalizeMutation<T>(
  response: ApiEntityResponse<T>
): ApiMutationResult<T> {
  return {
    data: normalizeEntity(response),
    ...(response.message?.trim() ? { message: response.message.trim() } : {}),
  }
}
