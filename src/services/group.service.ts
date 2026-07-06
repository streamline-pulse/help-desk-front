import { normalizeEntity, normalizeMutation, normalizePage } from "@/lib/api-response"
import { requestApi } from "@/lib/browser-api-client"
import type { GroupInput } from "@/schemas/group.schema"
import type { ApiEntityResponse, ApiListParams, ApiPagedResponse } from "@/types/api/api-data.type"
import type { Group } from "@/types/api/group.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/groups"

export const groupService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(await requestApi<ApiPagedResponse<Group>>(ENDPOINT, { searchParams: serializeListParams(request), signal })),
  listMine: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(await requestApi<ApiPagedResponse<Group>>(`${ENDPOINT}/me`, { searchParams: serializeListParams(request), signal })),
  get: async (id: string, signal?: AbortSignal) =>
    normalizeEntity(await requestApi<ApiEntityResponse<Group>>(`${ENDPOINT}/${encodeURIComponent(id)}`, { signal })),
  create: async (input: GroupInput) =>
    normalizeMutation(await requestApi<ApiEntityResponse<Group>>(ENDPOINT, { method: "post", json: input })),
  update: async (id: string, input: Partial<GroupInput>) =>
    normalizeMutation(await requestApi<ApiEntityResponse<Group>>(`${ENDPOINT}/${encodeURIComponent(id)}`, { method: "put", json: input })),
  remove: async (id: string) =>
    normalizeMutation(await requestApi<ApiEntityResponse<Group>>(`${ENDPOINT}/${encodeURIComponent(id)}`, { method: "delete" })),
}
