import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { RoleInput } from "@/schemas/role.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { Role } from "@/types/api/role.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/roles"

export const roleService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<Role>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  create: async (input: RoleInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Role>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (id: string, input: Partial<RoleInput>) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Role>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (id: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<Role>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "delete" }
      )
    ),
}
