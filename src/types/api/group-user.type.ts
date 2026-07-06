import type { ApiTimestamp } from "@/types/api/api-data.type"
import type { GroupSummary } from "@/types/api/group.type"
import type { GroupRole } from "@/types/api/group-role.type"

export type GroupUserSummary = {
  id: string
  email?: string | null
  phone?: string | null
  indicatif?: string | null
  lastName: string
  firstName: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}

export type GroupUserRolePermissionSummary = {
  moduleName: string
  permissions: string[]
}

export type GroupUserRoleSummary = {
  id: string
  name: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
  permissionsPerModule?: GroupUserRolePermissionSummary[]
}

export type GroupUserDetail = {
  id: string
  email?: string | null
  phone?: string | null
  indicatif?: string | null
  lastName: string
  firstName: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
  role: GroupUserRoleSummary
}

export type GroupCurrentUser = GroupUserDetail

export type GroupUser = {
  id: string
  groupId: string
  userId: string
  roleId: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
  group: GroupSummary
  user: GroupUserSummary
  role: GroupRole
}
