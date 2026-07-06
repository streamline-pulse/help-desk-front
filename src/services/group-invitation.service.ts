import { normalizeMutation, normalizePage } from "@/lib/api-response"
import { requestApi } from "@/lib/browser-api-client"
import type { AcceptGroupInvitationInput, GenerateGroupInvitationInput, GroupInvitationInput } from "@/schemas/group-invitation.schema"
import type { ApiEntityResponse, ApiListParams, ApiPagedResponse } from "@/types/api/api-data.type"
import type { GeneratedGroupInvitationResponse, GroupInvitation, GroupInvitationStatus } from "@/types/api/group-invitation.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/groups-users-invitations"

export const groupInvitationService = {
  list: async (groupId: string, status: GroupInvitationStatus, request: ApiListParams, signal?: AbortSignal) => {
    const suffix = status === "all" ? "" : `/${status}`
    return normalizePage(await requestApi<ApiPagedResponse<GroupInvitation>>(`${ENDPOINT}/groups/${encodeURIComponent(groupId)}${suffix}`, { searchParams: serializeListParams(request), signal }))
  },
  create: async (groupId: string, input: GroupInvitationInput) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupInvitation>>(`${ENDPOINT}/groups/${encodeURIComponent(groupId)}`, { method: "post", json: input })),
  generate: async (groupId: string, input: GenerateGroupInvitationInput) =>
    requestApi<GeneratedGroupInvitationResponse>(`${ENDPOINT}/groups/${encodeURIComponent(groupId)}/generate`, { method: "post", json: input }),
  accept: async (input: AcceptGroupInvitationInput) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupInvitation>>(`${ENDPOINT}/accept`, { method: "put", json: input })),
  remove: async (groupId: string, id: string) =>
    normalizeMutation(await requestApi<ApiEntityResponse<GroupInvitation>>(`${ENDPOINT}/groups/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`, { method: "delete" })),
}
