"use client"

import { IconUsersGroup } from "@tabler/icons-react"

import { GroupNav } from "@/app/(board)/board/groupes/_components/group-nav"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useGroupQuery } from "@/hooks/queries/use-group.query"

function GroupDetailLoading() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="grid gap-4 px-6 pt-10 pb-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <Skeleton className="mx-6 mb-4 h-9 w-80 max-w-full" />
    </div>
  )
}

export function GroupDetailLayout({
  groupId,
  children,
}: {
  groupId: string
  children: React.ReactNode
}) {
  const groupQuery = useGroupQuery(groupId)

  if (groupQuery.isPending) {
    return <GroupDetailLoading />
  }

  if (groupQuery.isError || !groupQuery.data) {
    return (
      <div className="flex flex-1 flex-col bg-background px-6 py-10">
        <Alert variant="destructive">
          <AlertTitle>Groupe indisponible</AlertTitle>
          <AlertDescription>
            Impossible de charger ce groupe. Revenez à la liste puis réessayez.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const group = groupQuery.data

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="px-6 pt-10 pb-6">
        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <IconUsersGroup className="size-3" stroke={1.75} />
          <span>Organisation · {group.type?.name ?? "Groupe"}</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl leading-tight font-semibold text-balance text-foreground">
              {group.name}
            </h1>
            <p className="mt-1 max-w-4xl text-base leading-relaxed text-pretty text-muted-foreground">
              {group.description ||
                "Gérez les accès, les membres et les invitations de ce groupe."}
            </p>
          </div>
          {group.parent ? (
            <Badge variant="outline">Rattaché à {group.parent.name}</Badge>
          ) : null}
        </div>
      </header>
      <GroupNav groupId={groupId} />
      {children}
    </div>
  )
}
