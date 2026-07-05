"use client"

import { ResourceDataTable } from "@/components/shared/configuration/resource-data-table"
import type { ResourceDataHooks } from "@/components/shared/configuration/resource-data.types"
import {
  useBulkDeleteRegionsMutation,
  useCreateRegionMutation,
  useDeleteRegionMutation,
  useRegionListQuery,
  useUpdateRegionMutation,
} from "@/hooks/queries/use-region.query"

const hooks = {
  useList: useRegionListQuery,
  useCreate: useCreateRegionMutation,
  useUpdate: useUpdateRegionMutation,
  useDelete: useDeleteRegionMutation,
  useBulkDelete: useBulkDeleteRegionsMutation,
} as unknown as ResourceDataHooks

export function RegionTable() {
  return <ResourceDataTable resource="regions" hooks={hooks} />
}
