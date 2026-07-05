import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { TownInput } from "@/schemas/town.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { Town, TownFilters } from "@/types/api/town.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/locations-towns"

export const townService = {
  list: async (request: ApiListParams<TownFilters>, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<Town>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: TownInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Town>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (slug: string, input: Partial<TownInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Town>>(
        `${ENDPOINT}/${encodeURIComponent(slug)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (slug: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Town>>(
        `${ENDPOINT}/${encodeURIComponent(slug)}`,
        { method: "delete" }
      )
    ),
}
