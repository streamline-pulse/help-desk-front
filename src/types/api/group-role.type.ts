import type { ApiTimestamp } from "@/types/api/api-data.type"
import type { GroupModule } from "@/types/api/group-module.type"
import type { GroupPermission } from "@/types/api/group-permission.type"

export type GroupRolePermission = {
  module: GroupModule
  permission: GroupPermission
}

export type GroupRole = {
  id: string
  name: string
  editable: boolean
  global: boolean
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
  permissionsPerModule: GroupRolePermission[]
}
