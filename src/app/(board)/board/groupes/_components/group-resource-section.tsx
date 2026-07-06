"use client"

import { GroupDetailSection } from "@/app/(board)/board/groupes/_components/group-detail.section"
import { GroupFileTable } from "@/app/(board)/board/groupes/_components/group-file.table"
import { GroupInvitationTable } from "@/app/(board)/board/groupes/_components/group-invitation.table"
import { GroupMemberTable } from "@/app/(board)/board/groupes/_components/group-member.table"
import { GroupRoleTable } from "@/app/(board)/board/groupes/_components/group-role.table"
import type { GroupDetailResource } from "@/config/group-ui"

function renderResource(resource: GroupDetailResource, groupId: string) {
  switch (resource) {
    case "roles":
      return <GroupRoleTable groupId={groupId} />
    case "membres":
      return <GroupMemberTable groupId={groupId} />
    case "invitations":
      return <GroupInvitationTable groupId={groupId} />
    case "fichiers":
      return <GroupFileTable groupId={groupId} />
  }
}

export function GroupResourceSection({
  groupId,
  resource,
  mode = "admin",
}: {
  groupId: string
  resource: GroupDetailResource
  mode?: "admin" | "group-space"
}) {
  return (
    <GroupDetailSection groupId={groupId} section={resource} mode={mode}>
      {renderResource(resource, groupId)}
    </GroupDetailSection>
  )
}
