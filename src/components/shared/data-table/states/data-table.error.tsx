import { IconAlertTriangle } from "@tabler/icons-react"

import type { NormalizedApiError } from "@/components/shared/data-table/data-table.types"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function DataTableError({
  error,
  retry,
}: {
  error: NormalizedApiError
  retry: () => void
}) {
  const title =
    error.kind === "authorization"
      ? "Accès refusé"
      : error.kind === "network"
        ? "Connexion impossible"
        : "Impossible de charger les données"
  return (
    <Empty className="min-h-40 border-0" role="alert">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconAlertTriangle />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{error.message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={retry}>
          Réessayer
        </Button>
      </EmptyContent>
    </Empty>
  )
}
