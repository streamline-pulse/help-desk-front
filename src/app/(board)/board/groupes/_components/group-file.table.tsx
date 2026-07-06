"use client"

import { useMemo, useRef, useState } from "react"
import {
  IconClock,
  IconFileDescription,
  IconPlus,
  IconTypography,
} from "@tabler/icons-react"

import { GroupFileDetailPanel } from "@/app/(board)/board/groupes/_components/group-file.detail.panel"
import {
  buildRowActions,
  TableActionsCell,
} from "@/components/shared/core-table/cells/actions.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { DetailTriggerCell } from "@/components/shared/core-table/cells/detail-trigger.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import { TableColumnHeader } from "@/components/shared/core-table/table.column-header"
import { TableDetailDrawer } from "@/components/shared/core-table/table.detail-drawer"
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation.modal"
import type {
  DataTableColumn,
  DataTableRequest,
} from "@/components/shared/core-table/table.types"
import { Button } from "@/components/ui/button"
import { useGroupFileListQuery, useUploadGroupFileMutation, useDeleteGroupFileMutation } from "@/hooks/queries/use-file.query"
import { useTableDetail } from "@/hooks/use-table-detail"
import type { PageResult } from "@/types/api/api-data.type"
import type { FileEntity } from "@/types/api/file.type"

type Filters = Record<string, never>

function formatFileSize(size: number | null) {
  if (size == null) return "Taille inconnue"
  if (size < 1024) return `${size} o`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`
}

export function GroupFileTable({ groupId }: { groupId: string }) {
  const [deleting, setDeleting] = useState<FileEntity | null>(null)
  const detail = useTableDetail<FileEntity>()
  const openDetail = detail.openDetail
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadGroupFileMutation(groupId)
  const deleteMutation = useDeleteGroupFileMutation(groupId)

  const columns = useMemo<DataTableColumn<FileEntity>[]>(
    () => [
      {
        id: "name",
        label: "Fichier",
        header: () => (
          <TableColumnHeader icon={IconFileDescription}>Fichier</TableColumnHeader>
        ),
        exportValue: (file) => file.name,
        cell: ({ row }) => (
          <DetailTriggerCell
            label={row.original.name}
            onClick={() => openDetail(row.original)}
          >
            <TextCell value={row.original.name} variant="primary" />
          </DetailTriggerCell>
        ),
      },
      {
        id: "type",
        label: "Type",
        header: () => (
          <TableColumnHeader icon={IconTypography}>Type</TableColumnHeader>
        ),
        exportValue: (file) => file.fileType,
        cell: ({ row }) => <TextCell value={row.original.fileType} />,
      },
      {
        id: "size",
        label: "Taille",
        header: () => <TableColumnHeader>Taille</TableColumnHeader>,
        exportValue: (file) => formatFileSize(file.size),
        cell: ({ row }) => <TextCell value={formatFileSize(row.original.size)} />,
      },
      {
        accessorKey: "updatedAt",
        label: "Modification",
        header: () => (
          <TableColumnHeader icon={IconClock}>Modification</TableColumnHeader>
        ),
        cell: ({ row }) => (
          <DateCell value={row.original.updatedAt} relativeUntilDays={3} />
        ),
      },
    ],
    [openDetail]
  )

  function useFilesQuery(request: DataTableRequest<Filters>) {
    return useGroupFileListQuery(groupId, request)
  }

  function getRowActions(file: FileEntity) {
    return buildRowActions({
      label: file.name,
      onDelete: () => {
        deleteMutation.reset()
        setDeleting(file)
      },
      deleteLabel: `Supprimer ${file.name}`,
    })
  }

  async function confirmDelete() {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      setDeleting(null)
      detail.closeDetail()
    } catch {}
  }

  return (
    <>
      <DataTable<FileEntity, FileEntity, Filters, PageResult<FileEntity>>
        id={`group-${groupId}-files`}
        query={useFilesQuery}
        responseAdapter={(response) => response}
        columns={columns}
        getRowId={(file) => file.id}
        defaultPageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        search={{
          enabled: true,
          placeholder: "Rechercher un fichier…",
          debounceMs: 400,
        }}
        capabilities={{
          pagination: true,
          search: true,
          filters: false,
          serverSorting: false,
        }}
        toolbarActions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(event) => {
                const nextFile = event.target.files?.[0]
                if (!nextFile) return
                void uploadMutation.mutateAsync(nextFile).finally(() => {
                  event.target.value = ""
                })
              }}
            />
            <Button
              size="sm"
              disabled={uploadMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconPlus />
              Ajouter un fichier
            </Button>
          </>
        }
        rowActions={(file) => (
          <TableActionsCell actions={getRowActions(file)} />
        )}
        export={{ enabled: true, filename: `groupe-${groupId}-fichiers` }}
        ariaLabel="Fichiers du groupe"
      />
      <TableDetailDrawer
        open={detail.open}
        onOpenChange={detail.onOpenChange}
        title={detail.item?.name ?? "Fichier"}
        description="Consultez les métadonnées et l’historique récent de ce fichier."
        actions={detail.item ? getRowActions(detail.item) : undefined}
      >
        {detail.item ? (
          <GroupFileDetailPanel groupId={groupId} file={detail.item} />
        ) : null}
      </TableDetailDrawer>
      <DeleteConfirmationModal
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setDeleting(null)
        }}
        level="simple"
        title="Supprimer ce fichier ?"
        description="Le fichier sera retiré du groupe."
        itemName={deleting?.name}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
