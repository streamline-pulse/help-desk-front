import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { GroupModuleInput } from "@/schemas/group-module.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { GroupModule } from "@/types/api/group-module.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/groups-modules"

export const groupModuleService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<GroupModule>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: GroupModuleInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<GroupModule>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (id: string, input: Partial<GroupModuleInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<GroupModule>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (id: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<GroupModule>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "delete" }
      )
    ),
}
