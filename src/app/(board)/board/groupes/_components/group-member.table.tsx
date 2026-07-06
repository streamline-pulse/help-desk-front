"use client"

import { useMemo, useState } from "react"
import {
  IconClock,
  IconMail,
  IconPlus,
  IconShield,
  IconUser,
} from "@tabler/icons-react"

import { GroupMemberDetailPanel } from "@/app/(board)/board/groupes/_components/group-member.detail.panel"
import { GroupMemberForm } from "@/app/(board)/board/groupes/_components/group-member.form"
import {
  buildRowActions,
  TableActionsCell,
} from "@/components/shared/core-table/cells/actions.cell"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { DetailTriggerCell } from "@/components/shared/core-table/cells/detail-trigger.cell"
import { LinkCell } from "@/components/shared/core-table/cells/link.cell"
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
import { useGroupRoleListQuery } from "@/hooks/queries/use-group-role.query"
import {
  useCreateGroupUserMutation,
  useDeleteGroupUserMutation,
  useGroupUserListQuery,
  useUpdateGroupUserMutation,
} from "@/hooks/queries/use-group-user.query"
import { useUserListQuery } from "@/hooks/queries/use-user.query"
import type { PageResult } from "@/types/api/api-data.type"
import type { GroupUser } from "@/types/api/group-user.type"

type Filters = Record<string, never>

const listRequest = { page: 1, perPage: 100, filters: {} }

function memberFullName(member: GroupUser) {
  return `${member.user.firstName} ${member.user.lastName}`.trim()
}

export function GroupMemberTable({ groupId }: { groupId: string }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<GroupUser | null>(null)
  const [deleting, setDeleting] = useState<GroupUser | null>(null)
  const detail = useTableDetail<GroupUser>()
  const membersQuery = useGroupUserListQuery(groupId, listRequest)
  const rolesQuery = useGroupRoleListQuery(groupId, listRequest)
  const usersQuery = useUserListQuery(listRequest)
  const createMutation = useCreateGroupUserMutation(groupId)
  const updateMutation = useUpdateGroupUserMutation(groupId)
  const deleteMutation = useDeleteGroupUserMutation(groupId)

  const memberUserIds = new Set(
    membersQuery.data?.rows.map((member) => member.userId) ?? []
  )
  const availableUsers =
    usersQuery.data?.rows.filter((user) => !memberUserIds.has(user.id)) ?? []

  const columns = useMemo<DataTableColumn<GroupUser>[]>(
    () => [
      {
        id: "name",
        label: "Utilisateur",
        header: () => (
          <TableColumnHeader icon={IconUser}>Utilisateur</TableColumnHeader>
        ),
        exportValue: memberFullName,
        cell: ({ row }) => (
          <DetailTriggerCell
            label={memberFullName(row.original)}
            onClick={() => detail.openDetail(row.original)}
          >
            <TextCell value={memberFullName(row.original)} variant="primary" />
          </DetailTriggerCell>
        ),
      },
      {
        id: "email",
        label: "E-mail",
        header: () => (
          <TableColumnHeader icon={IconMail}>E-mail</TableColumnHeader>
        ),
        exportValue: (member) => member.user.email ?? "",
        cell: ({ row }) => (
          <LinkCell
            href={
              row.original.user.email
                ? `mailto:${row.original.user.email}`
                : null
            }
            value={row.original.user.email}
            fallback="Sans e-mail"
          />
        ),
      },
      {
        id: "role",
        label: "Rôle",
        header: () => (
          <TableColumnHeader icon={IconShield}>Rôle</TableColumnHeader>
        ),
        exportValue: (member) => member.role.name,
        cell: ({ row }) => (
          <BadgeCell value={row.original.role.name} variant="outline" />
        ),
      },
      {
        accessorKey: "createdAt",
        label: "Ajout",
        header: () => (
          <TableColumnHeader icon={IconClock}>Ajout</TableColumnHeader>
        ),
        cell: ({ row }) => (
          <DateCell value={row.original.createdAt} relativeUntilDays={3} />
        ),
      },
    ],
    [detail.openDetail]
  )

  function useMembersQuery(request: DataTableRequest<Filters>) {
    return useGroupUserListQuery(groupId, request)
  }

  function getRowActions(member: GroupUser) {
    return buildRowActions({
      label: memberFullName(member),
      onEdit: () => {
        setEditing(member)
        setFormOpen(true)
      },
      onDelete: () => {
        deleteMutation.reset()
        setDeleting(member)
      },
      deleteLabel: `Retirer ${memberFullName(member)}`,
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
      <DataTable<GroupUser, GroupUser, Filters, PageResult<GroupUser>>
        id={`group-${groupId}-members`}
        query={useMembersQuery}
        responseAdapter={(response) => response}
        columns={columns}
        getRowId={(member) => member.id}
        defaultPageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        search={{
          enabled: true,
          placeholder: "Rechercher un membre…",
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
            disabled={!rolesQuery.data?.rows.length}
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <IconPlus />
            Ajouter un membre
          </Button>
        }
        rowActions={(member) => (
          <TableActionsCell actions={getRowActions(member)} />
        )}
        export={{ enabled: true, filename: `groupe-${groupId}-membres` }}
        ariaLabel="Membres du groupe"
      />
      <TableDetailDrawer
        open={detail.open}
        onOpenChange={detail.onOpenChange}
        title={detail.item ? memberFullName(detail.item) : "Membre"}
        description="Consultez le profil et le rôle de ce membre dans le groupe."
        actions={detail.item ? getRowActions(detail.item) : undefined}
      >
        {detail.item ? <GroupMemberDetailPanel member={detail.item} /> : null}
      </TableDetailDrawer>
      <GlobalModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
        title={editing ? "Modifier le rôle du membre" : "Ajouter un membre"}
        description="Les listes affichent les noms métier ; seuls les identifiants sont envoyés à l’API."
        preventClose={createMutation.isPending || updateMutation.isPending}
      >
        <GroupMemberForm
          key={editing?.id ?? "new"}
          member={editing}
          users={availableUsers}
          roles={rolesQuery.data?.rows ?? []}
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
        title="Retirer ce membre du groupe ?"
        description="Le compte utilisateur restera actif, mais son accès à ce groupe sera retiré."
        itemName={deleting ? memberFullName(deleting) : undefined}
        confirmLabel="Retirer"
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
