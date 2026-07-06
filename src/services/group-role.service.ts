import { normalizeMutation, normalizePage } from "@/lib/api-response"
import { requestApi } from "@/lib/browser-api-client"
import type { GroupRoleInput } from "@/schemas/group-role.schema"
import type { ApiEntityResponse, ApiListParams, ApiPagedResponse } from "@/types/api/api-data.type"
import type { GroupRole } from "@/types/api/group-role.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/groups-roles"

export const groupRoleService = {
  list: async (groupId: string, request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(await requestApi<ApiPagedResponse<GroupRole>>(`${ENDPOINT}/${encodeURIComponent(groupId)}`, { searchParams: serializeListParams(request), signal })),
  create: async (groupId: string, input: GroupRoleInput) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupRole>>(`${ENDPOINT}/${encodeURIComponent(groupId)}`, { method: "post", json: input })),
  update: async (groupId: string, id: string, input: Partial<GroupRoleInput>) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupRole>>(`${ENDPOINT}/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`, { method: "put", json: input })),
  remove: async (groupId: string, id: string) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupRole>>(`${ENDPOINT}/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`, { method: "delete" })),
}
