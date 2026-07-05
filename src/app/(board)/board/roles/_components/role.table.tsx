"use client"

import { ResourceDataTable } from "@/app/(board)/board/configuration/_components/resource-data-table"
import type { ResourceDataHooks } from "@/app/(board)/board/configuration/_components/resource-data.types"
import {
  useBulkDeleteRolesMutation,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useRoleListQuery,
  useUpdateRoleMutation,
} from "@/hooks/queries/use-role.query"

const hooks = {
  useList: useRoleListQuery,
  useCreate: useCreateRoleMutation,
  useUpdate: useUpdateRoleMutation,
  useDelete: useDeleteRoleMutation,
  useBulkDelete: useBulkDeleteRolesMutation,
} as unknown as ResourceDataHooks

export function RoleTable() {
  return <ResourceDataTable resource="roles" hooks={hooks} />
}
