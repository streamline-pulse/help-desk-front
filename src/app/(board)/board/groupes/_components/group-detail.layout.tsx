"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useGroupQuery } from "@/hooks/queries/use-group.query"

function GroupDetailLoading() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="grid gap-3 px-6 pt-10 pb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-48 max-w-full" />
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

  return <div className="flex flex-1 flex-col bg-background">{children}</div>
}
