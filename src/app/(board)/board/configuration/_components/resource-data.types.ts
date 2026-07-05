import type { DataTableQueryResult } from "@/components/shared/core-table/table.types"
import type { ApiListParams, PageResult } from "@/types/api/api-data.type"
import type {
  ConfigurationEntity,
  ConfigurationFilters,
  ConfigurationInput,
} from "@/types/configuration-resource.type"

export type ResourceMutation<TVariables> = {
  mutateAsync: (variables: TVariables) => Promise<unknown>
  isPending: boolean
  error: unknown
  reset: () => void
}

export type ResourceDataHooks = {
  useList: (
    request: ApiListParams<ConfigurationFilters>,
    enabled?: boolean
  ) => DataTableQueryResult<PageResult<ConfigurationEntity>>
  useCreate: () => ResourceMutation<ConfigurationInput>
  useUpdate: () => ResourceMutation<{
    identifier: string
    input: Partial<ConfigurationInput>
  }>
  useDelete: () => ResourceMutation<string>
  useBulkDelete: () => ResourceMutation<string[]>
}
