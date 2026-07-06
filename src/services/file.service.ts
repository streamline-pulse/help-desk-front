import { normalizeEntity, normalizeMutation, normalizePage } from "@/lib/api-response"
import { requestApi } from "@/lib/browser-api-client"
import type { ApiEntityResponse, ApiListParams, ApiPagedResponse } from "@/types/api/api-data.type"
import type { FileEntity } from "@/types/api/file.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/files"

export const fileService = {
  listByGroup: async (
    groupId: string,
    request: ApiListParams,
    signal?: AbortSignal
  ) =>
    normalizePage(
      await requestApi<ApiPagedResponse<FileEntity>>(
        `${ENDPOINT}/groups/${encodeURIComponent(groupId)}`,
        { searchParams: serializeListParams(request), signal }
      )
    ),
  get: async (id: string, signal?: AbortSignal) =>
    normalizeEntity(
      await requestApi<ApiEntityResponse<FileEntity>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { signal }
      )
    ),
  getByGroup: async (groupId: string, id: string, signal?: AbortSignal) =>
    normalizeEntity(
      await requestApi<ApiEntityResponse<FileEntity>>(
        `${ENDPOINT}/groups/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`,
        { signal }
      )
    ),
  createByGroup: async (groupId: string, file: File) => {
    const body = new FormData()
    body.set("file", file)

    return normalizeMutation(
      await requestApi<ApiEntityResponse<FileEntity>>(
        `${ENDPOINT}/groups/${encodeURIComponent(groupId)}`,
        { method: "post", body }
      )
    )
  },
  removeByGroup: async (groupId: string, id: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<FileEntity>>(
        `${ENDPOINT}/groups/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`,
        { method: "delete" }
      )
    ),
}
