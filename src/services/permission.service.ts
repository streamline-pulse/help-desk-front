import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { PermissionInput } from "@/schemas/permission.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { Permission } from "@/types/api/permission.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/permissions"

export const permissionService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<Permission>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: PermissionInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Permission>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (id: string, input: Partial<PermissionInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Permission>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (id: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Permission>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "delete" }
      )
    ),
}
