"use client"

import { ResourceDataTable } from "@/components/shared/configuration/resource-data-table"
import type { ResourceDataHooks } from "@/components/shared/configuration/resource-data.types"
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
