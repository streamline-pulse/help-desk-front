"use client"

import { ResourceDataTable } from "@/app/(board)/board/configuration/_components/resource-data-table"
import type { ResourceDataHooks } from "@/app/(board)/board/configuration/_components/resource-data.types"
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
