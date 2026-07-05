import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { LanguageInput } from "@/schemas/language.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { Language } from "@/types/api/language.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/languages"

export const languageService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<Language>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: LanguageInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Language>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (id: string, input: Partial<LanguageInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Language>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (id: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Language>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "delete" }
      )
    ),
}
