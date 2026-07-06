"use client"

import { useMemo, useState } from "react"
import {
  IconClock,
  IconPlus,
  IconShield,
  IconToggleRight,
} from "@tabler/icons-react"

import { GroupRoleDetailPanel } from "@/app/(board)/board/groupes/_components/group-role.detail.panel"
import { GroupRoleForm } from "@/app/(board)/board/groupes/_components/group-role.form"
import {
  buildRowActions,
  TableActionsCell,
} from "@/components/shared/core-table/cells/actions.cell"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { DetailTriggerCell } from "@/components/shared/core-table/cells/detail-trigger.cell"
import { NumberCell } from "@/components/shared/core-table/cells/number.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import { TableColumnHeader } from "@/components/shared/core-table/table.column-header"
import { TableDetailDrawer } from "@/components/shared/core-table/table.detail-drawer"
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation.modal"
import { GlobalModal } from "@/components/shared/global.modal"
import type {
  DataTableColumn,
  DataTableRequest,
} from "@/components/shared/core-table/table.types"
import { Button } from "@/components/ui/button"
import { useTableDetail } from "@/hooks/use-table-detail"
import {
  useCreateGroupRoleMutation,
  useDeleteGroupRoleMutation,
  useGroupRoleListQuery,
  useUpdateGroupRoleMutation,
} from "@/hooks/queries/use-group-role.query"
import { useGroupModuleListQuery } from "@/hooks/queries/use-group-module.query"
import { useGroupPermissionListQuery } from "@/hooks/queries/use-group-permission.query"
import { useCurrentGroupUserQuery } from "@/hooks/queries/use-group-user.query"
import type { PageResult } from "@/types/api/api-data.type"
import type { GroupRole } from "@/types/api/group-role.type"
import { hasGroupPermission } from "@/utils/group-permissions"

type Filters = Record<string, never>

const dependencyRequest = { page: 1, perPage: 100, filters: {} }

export function GroupRoleTable({ groupId }: { groupId: string }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<GroupRole | null>(null)
  const [deleting, setDeleting] = useState<GroupRole | null>(null)
  const detail = useTableDetail<GroupRole>()
  const openDetail = detail.openDetail
  const createMutation = useCreateGroupRoleMutation(groupId)
  const updateMutation = useUpdateGroupRoleMutation(groupId)
  const deleteMutation = useDeleteGroupRoleMutation(groupId)
  const modulesQuery = useGroupModuleListQuery(dependencyRequest)
  const permissionsQuery = useGroupPermissionListQuery(dependencyRequest)
  const currentGroupUserQuery = useCurrentGroupUserQuery(groupId)
  const canCreateRoles = hasGroupPermission(
    currentGroupUserQuery.data?.user,
    "groups-roles",
    "create"
  )
  const canUpdateRoles = hasGroupPermission(
    currentGroupUserQuery.data?.user,
    "groups-roles",
    "update"
  )
  const canDeleteRoles = hasGroupPermission(
    currentGroupUserQuery.data?.user,
    "groups-roles",
    "delete"
  )

  const columns = useMemo<DataTableColumn<GroupRole>[]>(
    () => [
      {
        accessorKey: "name",
        label: "Rôle",
        header: () => <TableColumnHeader>Rôle</TableColumnHeader>,
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
        id: "scope",
        label: "Portée",
        header: () => (
          <TableColumnHeader icon={IconToggleRight}>
            Portée
          </TableColumnHeader>
        ),
        exportValue: (role) => (role.global ? "Global" : "Groupe"),
        cell: ({ row }) => (
          <BadgeCell
            value={row.original.global ? "Global" : "Groupe"}
            variant="secondary"
          />
        ),
      },
      {
        id: "permissions",
        label: "Permissions",
        header: () => (
          <TableColumnHeader icon={IconShield}>Permissions</TableColumnHeader>
        ),
        exportValue: (role) => String(role.permissionsPerModule.length),
        cell: ({ row }) => (
          <NumberCell value={row.original.permissionsPerModule.length} />
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
    [openDetail]
  )

  function useRolesQuery(request: DataTableRequest<Filters>) {
    return useGroupRoleListQuery(groupId, request)
  }

  function getRowActions(role: GroupRole) {
    return buildRowActions({
      label: role.name,
      onEdit: role.editable && canUpdateRoles
        ? () => {
            setEditing(role)
            setFormOpen(true)
          }
        : undefined,
      onDelete: role.editable && canDeleteRoles
        ? () => {
            deleteMutation.reset()
            setDeleting(role)
          }
        : undefined,
      deleteLabel: `Supprimer ${role.name}`,
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
      <DataTable<GroupRole, GroupRole, Filters, PageResult<GroupRole>>
        id={`group-${groupId}-roles`}
        query={useRolesQuery}
        responseAdapter={(response) => response}
        columns={columns}
        getRowId={(role) => role.id}
        defaultPageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        search={{
          enabled: true,
          placeholder: "Rechercher un rôle…",
          debounceMs: 400,
        }}
        capabilities={{
          pagination: true,
          search: true,
          filters: false,
          serverSorting: false,
        }}
        toolbarActions={
          <Button
            size="sm"
            disabled={!canCreateRoles}
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <IconPlus />
            Créer un rôle
          </Button>
        }
        rowActions={(role) => (
          <TableActionsCell actions={getRowActions(role)} />
        )}
        export={{ enabled: true, filename: `groupe-${groupId}-roles` }}
        ariaLabel="Rôles du groupe"
      />
      <TableDetailDrawer
        open={detail.open}
        onOpenChange={detail.onOpenChange}
        title={detail.item?.name ?? "Rôle"}
        description="Consultez les permissions et la portée de ce rôle."
        size="lg"
        actions={detail.item ? getRowActions(detail.item) : undefined}
      >
        {detail.item ? <GroupRoleDetailPanel role={detail.item} /> : null}
      </TableDetailDrawer>
      <GlobalModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
        title={editing ? "Modifier le rôle" : "Créer un rôle de groupe"}
        description="Associez les permissions internes nécessaires à ce rôle."
        contentClassName="sm:max-w-3xl"
        preventClose={createMutation.isPending || updateMutation.isPending}
      >
        <GroupRoleForm
          key={editing?.id ?? "new"}
          role={editing}
          modules={modulesQuery.data?.rows ?? []}
          permissions={permissionsQuery.data?.rows ?? []}
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
        level="match"
        itemName={deleting?.name}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
