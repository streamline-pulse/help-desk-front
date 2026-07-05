"use client"

import { useState } from "react"
import { IconTrash } from "@tabler/icons-react"

import type { DeleteConfirmationLevel } from "@/components/shared/delete-confirmation.modal"
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation.modal"
import { useDataTableContext } from "@/components/shared/core-table/table.provider"
import { Button } from "@/components/ui/button"

export function DataTableBulkDeleteButton<TRow, TFilters>() {
  const { selectedRows, clearSelection, bulkDeleteConfig } =
    useDataTableContext<TRow, TFilters>()
  const [open, setOpen] = useState(false)

  if (!bulkDeleteConfig) return null

  const deleteConfig = bulkDeleteConfig
  const count = selectedRows.length
  const isPending = deleteConfig.isPending ?? false
  const level: DeleteConfirmationLevel = deleteConfig.level ?? "confirm"

  async function handleConfirm() {
    try {
      await deleteConfig.onDelete(selectedRows)
      clearSelection()
      setOpen(false)
    } catch {
      // Mutation errors stay visible via the parent mutation state.
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        disabled={count === 0 || isPending}
        onClick={() => {
          deleteConfig.onReset?.()
          setOpen(true)
        }}
      >
        <IconTrash />
        Supprimer
      </Button>
      <DeleteConfirmationModal
        open={open}
        onOpenChange={(next) => {
          if (!isPending) setOpen(next)
        }}
        level={level}
        title="Supprimer la sélection ?"
        description={`${count} élément${count > 1 ? "s" : ""} seront supprimés définitivement.`}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </>
  )
}
