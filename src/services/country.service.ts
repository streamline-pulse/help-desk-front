import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { CountryInput } from "@/schemas/country.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { Country } from "@/types/api/country.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/locations-countries"

export const countryService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<Country>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: CountryInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Country>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (slug: string, input: Partial<CountryInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Country>>(
        `${ENDPOINT}/${encodeURIComponent(slug)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (slug: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Country>>(
        `${ENDPOINT}/${encodeURIComponent(slug)}`,
        { method: "delete" }
      )
    ),
}
