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
