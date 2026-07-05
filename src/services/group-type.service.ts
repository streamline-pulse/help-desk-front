import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { GroupTypeInput } from "@/schemas/group-type.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { GroupType } from "@/types/api/group-type.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/groups-types"

export const groupTypeService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<GroupType>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: GroupTypeInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<GroupType>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (id: string, input: Partial<GroupTypeInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<GroupType>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (id: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<GroupType>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "delete" }
      )
    ),
}
