"use client"

import { GroupDetailPageHeader } from "@/app/(board)/board/groupes/_components/group-detail.page-header"
import { GroupNav } from "@/app/(board)/board/groupes/_components/group-nav"
import { Badge } from "@/components/ui/badge"
import type { GroupDetailResource } from "@/config/group-ui"
import { useCurrentGroupUserQuery } from "@/hooks/queries/use-group-user.query"

export function GroupDetailSection({
  groupId,
  section,
  mode = "admin",
  children,
}: {
  groupId: string
  section: GroupDetailResource
  mode?: "admin" | "group-space"
  children: React.ReactNode
}) {
  const currentGroupUserQuery = useCurrentGroupUserQuery(groupId)
  const currentRole = currentGroupUserQuery.data?.user?.role.name

  return (
    <>
      <GroupDetailPageHeader groupId={groupId} section={section} />
      <GroupNav groupId={groupId} mode={mode} />
      {currentRole ? (
        <div className="px-6 pb-4">
          <Badge variant="outline">
            Votre rôle dans ce groupe : {currentRole}
          </Badge>
        </div>
      ) : null}
      {children}
    </>
  )
}
