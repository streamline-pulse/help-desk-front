"use client"

import { PageHeader } from "@/components/shared/page/page.header"
import { Skeleton } from "@/components/ui/skeleton"
import type { GroupDetailResource } from "@/config/group-ui"
import { groupDetailUi } from "@/config/group-ui"
import { useGroupQuery } from "@/hooks/queries/use-group.query"

export function GroupDetailPageHeader({
  groupId,
  section,
}: {
  groupId: string
  section: GroupDetailResource
}) {
  const groupQuery = useGroupQuery(groupId)
  const ui = groupDetailUi[section]

  if (groupQuery.isPending) {
    return (
      <header className="grid gap-3 px-6 pt-10 pb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-48 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </header>
    )
  }

  return (
    <PageHeader
      label={groupQuery.data?.name ?? "Groupe"}
      title={ui.title}
      description={ui.description}
      icon={ui.icon}
    />
  )
}
