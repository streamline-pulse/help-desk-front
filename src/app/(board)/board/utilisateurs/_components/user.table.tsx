"use client"

import { useMemo, useState } from "react"
import {
  IconClock,
  IconMail,
  IconMailCheck,
  IconPlus,
  IconShield,
  IconToggleRight,
} from "@tabler/icons-react"

import { UserForm } from "@/app/(board)/board/utilisateurs/_components/user.form"
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation.modal"
import { GlobalModal } from "@/components/shared/global.modal"
import { TableActionsCell } from "@/components/shared/core-table/cells/actions.cell"
import { BooleanCell } from "@/components/shared/core-table/cells/boolean.cell"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { LinkCell } from "@/components/shared/core-table/cells/link.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import { TableColumnHeader } from "@/components/shared/core-table/table.column-header"
import type {
  DataTableColumn,
  DataTableRequest,
} from "@/components/shared/core-table/table.types"
import { Button } from "@/components/ui/button"
import {
  useBulkDeleteUsersMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUserListQuery,
} from "@/hooks/queries/use-user.query"
import { useRoleListQuery } from "@/hooks/queries/use-role.query"
import type { PageResult } from "@/types/api/api-data.type"
import type { User } from "@/types/api/user.type"

type Filters = Record<string, never>

export function UserTable() {
  const [editing, setEditing] = useState<User | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<User | null>(null)
  const createMutation = useCreateUserMutation()
  const updateMutation = useUpdateUserMutation()
  const deleteMutation = useDeleteUserMutation()
  const bulkDeleteMutation = useBulkDeleteUsersMutation()
  const rolesQuery = useRoleListQuery({ page: 1, perPage: 100, filters: {} })
  const roles = rolesQuery.data?.rows ?? []
  const columns = useMemo<DataTableColumn<User>[]>(
    () => [
      {
        id: "name",
        label: "Nom",
        header: () => <TableColumnHeader>Nom</TableColumnHeader>,
        exportValue: (user) => `${user.firstName} ${user.lastName}`.trim(),
        cell: ({ row }) => (
          <TextCell
            value={`${row.original.firstName} ${row.original.lastName}`.trim()}
            variant="primary"
          />
        ),
      },
      {
        accessorKey: "email",
        label: "E-mail",
        header: () => (
          <TableColumnHeader icon={IconMail}>E-mail</TableColumnHeader>
        ),
        cell: ({ row }) => (
          <LinkCell
            href={row.original.email ? `mailto:${row.original.email}` : null}
            value={row.original.email}
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
        exportValue: (user) => user.role?.name ?? "",
        cell: ({ row }) => (
          <BadgeCell
            value={row.original.role?.name}
            variant="outline"
            fallback="Non attribué"
          />
        ),
      },
      {
        id: "status",
        label: "Statut",
        header: () => (
          <TableColumnHeader icon={IconToggleRight}>Statut</TableColumnHeader>
        ),
        exportValue: (user) => (user.active ? "Actif" : "Inactif"),
        cell: ({ row }) => (
          <BooleanCell value={row.original.active} preset="active" />
        ),
      },
      {
        id: "verification",
        label: "Vérification",
        header: () => (
          <TableColumnHeader icon={IconMailCheck}>Vérification</TableColumnHeader>
        ),
        exportValue: (user) =>
          user.emailVerified ? "E-mail vérifié" : "En attente",
        cell: ({ row }) => (
          <BooleanCell value={row.original.emailVerified} preset="verified" />
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
    []
  )
  function useUsersQuery(request: DataTableRequest<Filters>) {
    return useUserListQuery(request)
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
      <DataTable<User, User, Filters, PageResult<User>>
        id="users"
        query={useUsersQuery}
        responseAdapter={(response) => response}
        columns={columns}
        getRowId={(user) => user.id}
        defaultPageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        search={{
          enabled: true,
          placeholder: "Rechercher un utilisateur…",
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
        rowActions={(user) => (
          <TableActionsCell
            label={`${user.firstName} ${user.lastName}`.trim()}
            onEdit={() => {
              setEditing(user)
              setFormOpen(true)
            }}
            onDelete={() => {
              deleteMutation.reset()
              setDeleting(user)
            }}
          />
        )}
        bulkDelete={{
          level: "confirm",
          isPending: bulkDeleteMutation.isPending,
          onReset: () => bulkDeleteMutation.reset(),
          onDelete: async (rows) => {
            await bulkDeleteMutation.mutateAsync(rows.map((user) => user.id))
          },
        }}
        export={{ enabled: true, filename: "utilisateurs" }}
        ariaLabel="Liste des utilisateurs"
      />
      <GlobalModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
        title={
          editing ? "Modifier l’utilisateur" : "Ajouter un utilisateur"
        }
        description="Renseignez son identité, son rôle et son niveau d’accès."
        contentClassName="sm:max-w-xl"
        preventClose={createMutation.isPending || updateMutation.isPending}
      >
        <UserForm
          key={editing?.id ?? "new"}
          user={editing}
          roles={roles}
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
        itemName={
          deleting
            ? `${deleting.firstName} ${deleting.lastName}`.trim()
            : undefined
        }
        matchValue={deleting?.email ?? undefined}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
