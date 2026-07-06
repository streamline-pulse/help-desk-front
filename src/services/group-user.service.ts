import { normalizeMutation, normalizePage } from "@/lib/api-response"
import { requestApi } from "@/lib/browser-api-client"
import type { CreateGroupUserInput, UpdateGroupUserInput } from "@/schemas/group-user.schema"
import type { ApiEntityResponse, ApiListParams, ApiPagedResponse } from "@/types/api/api-data.type"
import type {
  GroupCurrentUser,
  GroupUser,
  GroupUserDetail,
} from "@/types/api/group-user.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/groups-users/groups"

export const groupUserService = {
  list: async (
    groupId: string,
    request: ApiListParams<{ roleId?: string }>,
    signal?: AbortSignal
  ) => {
    const roleId =
      typeof request.filters?.roleId === "string"
        ? request.filters.roleId
        : undefined
    const path = roleId
      ? `${ENDPOINT}/${encodeURIComponent(groupId)}/roles/${encodeURIComponent(roleId)}`
      : `${ENDPOINT}/${encodeURIComponent(groupId)}`

    const searchParams = serializeListParams({
      ...request,
      filters: roleId ? {} : request.filters,
    })

    return normalizePage(
      await requestApi<ApiPagedResponse<GroupUser>>(path, {
        searchParams,
        signal,
      })
    )
  },
  create: async (groupId: string, input: CreateGroupUserInput) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupUser>>(`${ENDPOINT}/${encodeURIComponent(groupId)}`, { method: "post", json: input })),
  update: async (groupId: string, id: string, input: UpdateGroupUserInput) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupUser>>(`${ENDPOINT}/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`, { method: "put", json: input })),
  get: async (groupId: string, userId: string, signal?: AbortSignal) =>
    requestApi<{ user: GroupUserDetail | null }>(
      `${ENDPOINT}/${encodeURIComponent(groupId)}/users/${encodeURIComponent(userId)}`,
      { signal }
    ),
  getCurrent: async (groupId: string, userId: string, signal?: AbortSignal) =>
    requestApi<{ user: GroupCurrentUser | null }>(
      `${ENDPOINT}/${encodeURIComponent(groupId)}/users/me/${encodeURIComponent(userId)}`,
      { signal }
    ),
  remove: async (groupId: string, id: string) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupUser>>(`${ENDPOINT}/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`, { method: "delete" })),
}
