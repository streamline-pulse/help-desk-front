import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type { CreateUserInput, UpdateUserInput } from "@/schemas/user.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type { User } from "@/types/api/user.type"
import { serializeListParams } from "@/utils/api-query"

const ENDPOINT = "/api/v1/users"

export const userService = {
  list: async (request: ApiListParams, signal?: AbortSignal) =>
    normalizePage(
      await requestApi<ApiPagedResponse<User>>(ENDPOINT, {
        searchParams: serializeListParams(request),
        signal,
      })
    ),
  get: async (id: string, signal?: AbortSignal) =>
    requestApi<ApiEntityResponse<User>>(
      `${ENDPOINT}/${encodeURIComponent(id)}`,
      { signal }
    ),
  create: async (input: CreateUserInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<User>>(ENDPOINT, {
        method: "post",
        json: input,
      })
    ),
  update: async (id: string, input: UpdateUserInput) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<User>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "put", json: input }
      )
    ),
  remove: async (id: string) =>
    normalizeMutation(
      await requestApi<ApiEntityResponse<User>>(
        `${ENDPOINT}/${encodeURIComponent(id)}`,
        { method: "delete" }
      )
    ),
}
