"use client"

import { ResourceDataTable } from "@/app/(board)/board/configuration/_components/resource-data-table"
import type { ResourceDataHooks } from "@/app/(board)/board/configuration/_components/resource-data.types"
import {
  useBulkDeleteModulesMutation,
  useCreateModuleMutation,
  useDeleteModuleMutation,
  useModuleListQuery,
  useUpdateModuleMutation,
} from "@/hooks/queries/use-module.query"

const hooks = {
  useList: useModuleListQuery,
  useCreate: useCreateModuleMutation,
  useUpdate: useUpdateModuleMutation,
  useDelete: useDeleteModuleMutation,
  useBulkDelete: useBulkDeleteModulesMutation,
} as unknown as ResourceDataHooks

export function ModuleTable() {
  return <ResourceDataTable resource="modules" hooks={hooks} />
}
