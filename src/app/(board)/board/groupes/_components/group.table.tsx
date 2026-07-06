"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import {
  IconBuildingCommunity,
  IconClock,
  IconPlus,
  IconSitemap,
} from "@tabler/icons-react"

import { GroupForm } from "@/app/(board)/board/groupes/_components/group.form"
import {
  buildRowActions,
  TableActionsCell,
} from "@/components/shared/core-table/cells/actions.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { PageLinkTriggerCell } from "@/components/shared/core-table/cells/page-link-trigger.cell"
import { RelationCell } from "@/components/shared/core-table/cells/relation.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import { TableColumnHeader } from "@/components/shared/core-table/table.column-header"
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation.modal"
import { GlobalModal } from "@/components/shared/global.modal"
import type {
  DataTableColumn,
  DataTableRequest,
} from "@/components/shared/core-table/table.types"
import { Button } from "@/components/ui/button"
import { routes } from "@/config/routes"
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGroupListQuery,
  useUpdateGroupMutation,
} from "@/hooks/queries/use-group.query"
import { useGroupTypeListQuery } from "@/hooks/queries/use-group-type.query"
import { useTownListQuery } from "@/hooks/queries/use-town.query"
import type { PageResult } from "@/types/api/api-data.type"
import type { Group } from "@/types/api/group.type"

type Filters = Record<string, never>

const dependencyRequest = { page: 1, perPage: 100, filters: {} }

export function GroupTable() {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Group | null>(null)
  const [deleting, setDeleting] = useState<Group | null>(null)
  const createMutation = useCreateGroupMutation()
  const updateMutation = useUpdateGroupMutation()
  const deleteMutation = useDeleteGroupMutation()
  const groupsQuery = useGroupListQuery(dependencyRequest)
  const groupTypesQuery = useGroupTypeListQuery(dependencyRequest)
  const townsQuery = useTownListQuery(dependencyRequest)

  const columns = useMemo<DataTableColumn<Group>[]>(
    () => [
      {
        accessorKey: "name",
        label: "Nom",
        header: () => <TableColumnHeader>Nom</TableColumnHeader>,
        cell: ({ row }) => (
          <PageLinkTriggerCell
            label={row.original.name}
            onClick={() =>
              router.push(routes.board.groups.roles(row.original.id))
            }
          >
            <TextCell value={row.original.name} variant="primary" />
          </PageLinkTriggerCell>
        ),
      },
      {
        id: "type",
        label: "Type",
        header: () => (
          <TableColumnHeader icon={IconBuildingCommunity}>Type</TableColumnHeader>
        ),
        exportValue: (group) => group.type?.name ?? "",
        cell: ({ row }) => (
          <RelationCell value={row.original.type?.name} />
        ),
      },
      {
        id: "parent",
        label: "Parent",
        header: () => (
          <TableColumnHeader icon={IconSitemap}>Parent</TableColumnHeader>
        ),
        exportValue: (group) => group.parent?.name ?? "",
        cell: ({ row }) => (
          <RelationCell value={row.original.parent?.name} />
        ),
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
    [router]
  )

  function useGroupsQuery(request: DataTableRequest<Filters>) {
    return useGroupListQuery(request)
  }

  function getRowActions(group: Group) {
    return buildRowActions({
      label: group.name,
      onEdit: () => {
        setEditing(group)
        setFormOpen(true)
      },
      onDelete: () => {
        deleteMutation.reset()
        setDeleting(group)
      },
    })
  }

  async function confirmDelete() {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      setDeleting(null)
    } catch {}
  }

  return (
    <>
      <DataTable<Group, Group, Filters, PageResult<Group>>
        id="groups"
        query={useGroupsQuery}
        responseAdapter={(response) => response}
        columns={columns}
        getRowId={(group) => group.id}
        defaultPageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        search={{
          enabled: true,
          placeholder: "Rechercher un groupe…",
          debounceMs: 400,
        }}
        capabilities={{
          pagination: true,
          search: true,
          filters: false,
          serverSorting: false,
        }}
        selectable
        toolbarActions={
          <Button
            size="sm"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <IconPlus />
            Ajouter
          </Button>
        }
        rowActions={(group) => (
          <TableActionsCell actions={getRowActions(group)} />
        )}
        export={{ enabled: true, filename: "groupes" }}
        ariaLabel="Liste des groupes"
      />
      <GlobalModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
        title={editing ? "Modifier le groupe" : "Créer un groupe"}
        description="Renseignez l’identité, le rattachement et la localisation du groupe."
        contentClassName="sm:max-w-2xl"
        preventClose={createMutation.isPending || updateMutation.isPending}
      >
        <GroupForm
          key={editing?.id ?? "new"}
          group={editing}
          groups={groupsQuery.data?.rows ?? []}
          groupTypes={groupTypesQuery.data?.rows ?? []}
          towns={townsQuery.data?.rows ?? []}
          createMutation={createMutation}
          updateMutation={updateMutation}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      </GlobalModal>
      <DeleteConfirmationModal
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setDeleting(null)
        }}
        level="confirm"
        itemName={deleting?.name}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
