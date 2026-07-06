"use client"

import { GroupDetailPageHeader } from "@/app/(board)/board/groupes/_components/group-detail.page-header"
import { GroupNav } from "@/app/(board)/board/groupes/_components/group-nav"
import type { GroupDetailResource } from "@/config/group-ui"

export function GroupDetailSection({
  groupId,
  section,
  children,
}: {
  groupId: string
  section: GroupDetailResource
  children: React.ReactNode
}) {
  return (
    <>
      <GroupDetailPageHeader groupId={groupId} section={section} />
      <GroupNav groupId={groupId} />
      {children}
    </>
  )
}
