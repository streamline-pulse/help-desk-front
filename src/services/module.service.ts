import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { ModuleInput } from "@/schemas/module.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { Module } from "@/types/api/module.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/modules"

export const moduleService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<Module>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: ModuleInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Module>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (id: string, input: Partial<ModuleInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Module>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (id: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Module>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "delete" }
      )
    ),
}
