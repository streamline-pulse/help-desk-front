"use client"

import type { ComponentType } from "react"
import { IconEdit, IconTrash } from "@tabler/icons-react"

import { CellShell } from "@/components/shared/core-table/cells/cell.utils"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { cn } from "@/lib/utils"

export type TableRowAction = {
  id: string
  label: string
  icon: ComponentType<{ className?: string; stroke?: number }>
  onClick: () => void
  destructive?: boolean
  hidden?: boolean
}

type TableActionsCellProps = {
  label?: string
  onEdit?: () => void
  onDelete?: () => void
  editLabel?: string
  deleteLabel?: string
  actions?: TableRowAction[]
  className?: string
}

function buildDefaultActions({
  label,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: Pick<
  TableActionsCellProps,
  "label" | "onEdit" | "onDelete" | "editLabel" | "deleteLabel"
>): TableRowAction[] {
  const actions: TableRowAction[] = []

  if (onEdit) {
    actions.push({
      id: "edit",
      label: editLabel ?? (label ? `Modifier ${label}` : "Modifier"),
      icon: IconEdit,
      onClick: onEdit,
    })
  }

  if (onDelete) {
    actions.push({
      id: "delete",
      label: deleteLabel ?? (label ? `Supprimer ${label}` : "Supprimer"),
      icon: IconTrash,
      onClick: onDelete,
      destructive: true,
    })
  }

  return actions
}

export function TableActionsCell({
  label,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
  actions = [],
  className,
}: TableActionsCellProps) {
  const visibleActions = [
    ...buildDefaultActions({ label, onEdit, onDelete, editLabel, deleteLabel }),
    ...actions,
  ].filter((action) => !action.hidden)

  if (visibleActions.length === 0) return null

  return (
    <CellShell className={cn("flex justify-end", className)}>
      <ButtonGroup>
        {visibleActions.map((action) => (
          <Button
            key={action.id}
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={action.label}
            className={cn(
              action.destructive &&
                "text-destructive hover:bg-destructive/10 hover:text-destructive"
            )}
            onClick={action.onClick}
          >
            <action.icon className="size-3.5" stroke={1.75} aria-hidden="true" />
          </Button>
        ))}
      </ButtonGroup>
    </CellShell>
  )
}
