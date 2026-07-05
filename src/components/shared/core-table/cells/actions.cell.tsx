"use client"

import type { ComponentType } from "react"
import { IconEdit, IconTrash } from "@tabler/icons-react"

import { CellShell } from "@/components/shared/core-table/cells/cell.utils"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  getIconButtonSizeProps,
  IconButton,
} from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

export type TableRowAction = {
  id: string
  label: string
  icon: ComponentType<{ className?: string; stroke?: number }>
  onClick: () => void
  destructive?: boolean
  hidden?: boolean
}

type BuildRowActionsInput = {
  label?: string
  onEdit?: () => void
  onDelete?: () => void
  editLabel?: string
  deleteLabel?: string
}

export function buildRowActions({
  label,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: BuildRowActionsInput): TableRowAction[] {
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

type TableRowActionsButtonsProps = {
  actions: TableRowAction[]
  className?: string
  size?: "sm" | "md"
}

export function TableRowActionsButtons({
  actions,
  className,
  size = "sm",
}: TableRowActionsButtonsProps) {
  const visibleActions = actions.filter((action) => !action.hidden)
  const sizeProps = getIconButtonSizeProps(size)

  if (visibleActions.length === 0) return null

  return (
    <ButtonGroup className={className}>
      {visibleActions.map((action) => (
        <IconButton
          key={action.id}
          type="button"
          variant="outline"
          tooltip={action.label}
          tooltipSide="top"
          {...sizeProps}
          className={cn(
            action.destructive &&
              "text-destructive hover:bg-destructive/10 hover:text-destructive"
          )}
          onClick={action.onClick}
          data-table-interactive="true"
        >
          <action.icon className="size-3.5" stroke={1.75} aria-hidden="true" />
        </IconButton>
      ))}
    </ButtonGroup>
  )
}

type TableActionsCellProps = BuildRowActionsInput & {
  actions?: TableRowAction[]
  className?: string
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
    ...buildRowActions({ label, onEdit, onDelete, editLabel, deleteLabel }),
    ...actions,
  ]

  if (visibleActions.filter((action) => !action.hidden).length === 0) {
    return null
  }

  return (
    <CellShell className={cn("flex justify-end", className)}>
      <TableRowActionsButtons actions={visibleActions} />
    </CellShell>
  )
}
