import { requestApi } from "@/lib/browser-api-client"
import { normalizeMutation, normalizePage } from "@/lib/api-response"
import type {
  GroupCapabilityInput,
  GroupTypeInput,
} from "@/schemas/group-configuration.schema"
import type {
  ApiEntityResponse,
  ApiListParams,
  ApiPagedResponse,
} from "@/types/api/api-data.type"
import type {
  GroupModule,
  GroupPermission,
  GroupType,
} from "@/types/api/group-configuration.type"
import { serializeListParams } from "@/utils/api-query"

type Entity = GroupType | GroupModule | GroupPermission
type Input = GroupTypeInput | GroupCapabilityInput

function resourceService<TEntity extends Entity, TInput extends Input>(
  endpoint: string
) {
  return {
    list: async (request: ApiListParams, signal?: AbortSignal) =>
      normalizePage(
        await requestApi<ApiPagedResponse<TEntity>>(endpoint, {
          searchParams: serializeListParams(request),
          signal,
        })
      ),
    create: async (input: TInput) =>
      normalizeMutation(
        await requestApi<ApiEntityResponse<TEntity>>(endpoint, {
          method: "post",
          json: input,
        })
      ),
    update: async (id: string, input: Partial<TInput>) =>
      normalizeMutation(
        await requestApi<ApiEntityResponse<TEntity>>(
          `${endpoint}/${encodeURIComponent(id)}`,
          { method: "put", json: input }
        )
      ),
    remove: async (id: string) =>
      normalizeMutation(
        await requestApi<ApiEntityResponse<TEntity>>(
          `${endpoint}/${encodeURIComponent(id)}`,
          { method: "delete" }
        )
      ),
  }
}

export const groupTypeService = resourceService<GroupType, GroupTypeInput>(
  "/api/v1/groups-types"
)
export const groupModuleService = resourceService<
  GroupModule,
  GroupCapabilityInput
>("/api/v1/groups-modules")
export const groupPermissionService = resourceService<
  GroupPermission,
  GroupCapabilityInput
>("/api/v1/groups-permissions")
