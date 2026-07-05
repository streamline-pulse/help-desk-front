import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { GroupPermissionInput } from "@/schemas/group-permission.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { GroupPermission } from "@/types/api/group-permission.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/groups-permissions"

export const groupPermissionService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<GroupPermission>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: GroupPermissionInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<GroupPermission>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (id: string, input: Partial<GroupPermissionInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<GroupPermission>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (id: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<GroupPermission>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "delete" }
      )
    ),
}
