"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { GroupDetailResource } from "@/config/group-ui"
import { routes } from "@/config/routes"
import { useActiveGroupContext } from "@/hooks/use-active-group-context"
import { GroupResourceSection } from "@/app/(board)/board/groupes/_components/group-resource-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GroupResourceContent({
  resource,
}: {
  resource: GroupDetailResource
}) {
  const activeGroup = useActiveGroupContext()

  if (activeGroup.status === "loading") {
    return (
      <div className="flex flex-1 flex-col bg-background px-6 py-10">
        <Alert>
          <AlertTitle>Chargement du groupe actif</AlertTitle>
          <AlertDescription>
            Le contexte du groupe est en cours de préparation.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (activeGroup.status === "missing" || !activeGroup.groupId) {
    return (
      <div className="flex flex-1 flex-col bg-background px-6 py-10">
        <Alert>
          <AlertTitle>Aucun groupe actif</AlertTitle>
          <AlertDescription>
            Sélectionnez un groupe depuis le switch en haut à gauche ou
            ouvrez la liste complète pour continuer.
          </AlertDescription>
        </Alert>
        <div className="pt-4">
          <Button render={<Link href={routes.board.groups.root} />}>
            Voir les groupes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <GroupResourceSection
      groupId={activeGroup.groupId}
      resource={resource}
      mode="group-space"
    />
  )
}
