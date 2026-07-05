import type {
  ApiListParams,
  ApiListParamValue,
} from "@/types/api/api-data.type"

function isEmpty(value: ApiListParamValue | null | undefined) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
}

function serializeValue(value: ApiListParamValue) {
  return Array.isArray(value) ? value.join(",") : String(value)
}

export function serializeListParams<TFilters>(
  request: ApiListParams<TFilters>
) {
  const params = new URLSearchParams()
  const page = Number.isFinite(request.page) && request.page > 0 ? request.page : 1
  const perPage =
    Number.isFinite(request.perPage) && request.perPage > 0
      ? request.perPage
      : 50

  params.set("page", String(page))
  params.set("perPage", String(perPage))

  if (request.search?.trim()) params.set("search", request.search.trim())
  for (const [key, value] of Object.entries(request.filters ?? {}) as Array<
    [string, ApiListParamValue | null | undefined]
  >) {
    if (value !== undefined && value !== null && !isEmpty(value)) {
      params.set(key, serializeValue(value))
    }
  }

  return params
}
