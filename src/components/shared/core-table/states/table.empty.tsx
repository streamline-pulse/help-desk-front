import { IconDatabaseOff } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function DataTableEmpty({
  filtered,
  reset,
}: {
  filtered: boolean
  reset: () => void
}) {
  return (
    <Empty className="min-h-40 border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconDatabaseOff />
        </EmptyMedia>
        <EmptyTitle>
          {filtered ? "Aucun résultat" : "Aucune donnée disponible"}
        </EmptyTitle>
        <EmptyDescription>
          {filtered
            ? "Aucune ligne ne correspond aux critères actuels."
            : "Les données apparaîtront ici lorsqu’elles seront disponibles."}
        </EmptyDescription>
      </EmptyHeader>
      {filtered ? (
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={reset}>
            Réinitialiser les filtres
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
