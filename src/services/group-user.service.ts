import { normalizeMutation, normalizePage } from "@/lib/api-response"
import { requestApi } from "@/lib/browser-api-client"
import type { CreateGroupUserInput, UpdateGroupUserInput } from "@/schemas/group-user.schema"
import type { ApiEntityResponse, ApiListParams, ApiPagedResponse } from "@/types/api/api-data.type"
import type { GroupUser } from "@/types/api/group-user.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/groups-users/groups"

export const groupUserService = {
  list: async (groupId: string, request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(await requestApi<ApiPagedResponse<GroupUser>>(`${ENDPOINT}/${encodeURIComponent(groupId)}`, { searchParams: serializeListParams(request), signal })),
  create: async (groupId: string, input: CreateGroupUserInput) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupUser>>(`${ENDPOINT}/${encodeURIComponent(groupId)}`, { method: "post", json: input })),
  update: async (groupId: string, id: string, input: UpdateGroupUserInput) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupUser>>(`${ENDPOINT}/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`, { method: "put", json: input })),
  remove: async (groupId: string, id: string) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupUser>>(`${ENDPOINT}/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`, { method: "delete" })),
}
