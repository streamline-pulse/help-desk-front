"use client"

import { ResourceDataTable } from "@/app/(board)/board/configuration/_components/resource-data-table"
import type { ResourceDataHooks } from "@/app/(board)/board/configuration/_components/resource-data.types"
import {
  useBulkDeleteGroupModulesMutation,
  useCreateGroupModuleMutation,
  useDeleteGroupModuleMutation,
  useGroupModuleListQuery,
  useUpdateGroupModuleMutation,
} from "@/hooks/queries/use-group-module.query"
import {
  useBulkDeleteGroupPermissionsMutation,
  useCreateGroupPermissionMutation,
  useDeleteGroupPermissionMutation,
  useGroupPermissionListQuery,
  useUpdateGroupPermissionMutation,
} from "@/hooks/queries/use-group-permission.query"
import {
  useBulkDeleteGroupTypesMutation,
  useCreateGroupTypeMutation,
  useDeleteGroupTypeMutation,
  useGroupTypeListQuery,
  useUpdateGroupTypeMutation,
} from "@/hooks/queries/use-group-type.query"

export type GroupConfigurationResource =
  | "group-types"
  | "group-modules"
  | "group-permissions"

const hooks = {
  "group-types": {
    useList: useGroupTypeListQuery,
    useCreate: useCreateGroupTypeMutation,
    useUpdate: useUpdateGroupTypeMutation,
    useDelete: useDeleteGroupTypeMutation,
    useBulkDelete: useBulkDeleteGroupTypesMutation,
  },
  "group-modules": {
    useList: useGroupModuleListQuery,
    useCreate: useCreateGroupModuleMutation,
    useUpdate: useUpdateGroupModuleMutation,
    useDelete: useDeleteGroupModuleMutation,
    useBulkDelete: useBulkDeleteGroupModulesMutation,
  },
  "group-permissions": {
    useList: useGroupPermissionListQuery,
    useCreate: useCreateGroupPermissionMutation,
    useUpdate: useUpdateGroupPermissionMutation,
    useDelete: useDeleteGroupPermissionMutation,
    useBulkDelete: useBulkDeleteGroupPermissionsMutation,
  },
}

export function GroupConfigurationTable({
  resource,
}: {
  resource: GroupConfigurationResource
}) {
  return (
    <ResourceDataTable
      resource={resource}
      hooks={hooks[resource] as unknown as ResourceDataHooks}
    />
  )
}
