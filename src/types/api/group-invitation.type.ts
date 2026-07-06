import type { ApiTimestamp } from "@/types/api/api-data.type"
import type { GroupSummary } from "@/types/api/group.type"
import type { GroupRole } from "@/types/api/group-role.type"
import type { GroupUserSummary } from "@/types/api/group-user.type"

export type GroupInvitationStatus = "all" | "active" | "accepted" | "expired"

export type GroupInvitation = {
  id: string
  email?: string | null
  acceptedEmail?: string | null
  expirationDate: ApiTimestamp
  accepted: boolean
  groupId: string
  roleId: string
  invitedById: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
  group: GroupSummary
  role: Pick<GroupRole, "id" | "name" | "createdAt" | "updatedAt">
  invitedBy: GroupUserSummary
}

export type GeneratedGroupInvitationResponse = {
  data?: GroupInvitation | null
  token: string
}
