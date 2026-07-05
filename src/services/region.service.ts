import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { RegionInput } from "@/schemas/region.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { Region, RegionFilters } from "@/types/api/region.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/locations-regions"

export const regionService = {
  list: async (request: ApiListParams<RegionFilters>, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<Region>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: RegionInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Region>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (slug: string, input: Partial<RegionInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Region>>(
        `${ENDPOINT}/${encodeURIComponent(slug)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (slug: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Region>>(
        `${ENDPOINT}/${encodeURIComponent(slug)}`,
        { method: "delete" }
      )
    ),
}
