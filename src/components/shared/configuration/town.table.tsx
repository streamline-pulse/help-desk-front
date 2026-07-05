"use client"

import { ResourceDataTable } from "@/components/shared/configuration/resource-data-table"
import type { ResourceDataHooks } from "@/components/shared/configuration/resource-data.types"
import {
  useBulkDeleteTownsMutation,
  useCreateTownMutation,
  useDeleteTownMutation,
  useTownListQuery,
  useUpdateTownMutation,
} from "@/hooks/queries/use-town.query"

const hooks = {
  useList: useTownListQuery,
  useCreate: useCreateTownMutation,
  useUpdate: useUpdateTownMutation,
  useDelete: useDeleteTownMutation,
  useBulkDelete: useBulkDeleteTownsMutation,
} as unknown as ResourceDataHooks

export function TownTable() {
  return <ResourceDataTable resource="towns" hooks={hooks} />
}
