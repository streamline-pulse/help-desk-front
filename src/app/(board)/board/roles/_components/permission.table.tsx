"use client"

import { ResourceDataTable } from "@/app/(board)/board/configuration/_components/resource-data-table"
import type { ResourceDataHooks } from "@/app/(board)/board/configuration/_components/resource-data.types"
import {
  useBulkDeletePermissionsMutation,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  usePermissionListQuery,
  useUpdatePermissionMutation,
} from "@/hooks/queries/use-permission.query"

const hooks = {
  useList: usePermissionListQuery,
  useCreate: useCreatePermissionMutation,
  useUpdate: useUpdatePermissionMutation,
  useDelete: useDeletePermissionMutation,
  useBulkDelete: useBulkDeletePermissionsMutation,
} as unknown as ResourceDataHooks

export function PermissionTable() {
  return <ResourceDataTable resource="permissions" hooks={hooks} />
}
