"use client"

import { useMemo, useState } from "react"
import {
  IconDownload,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"

import { UserForm } from "@/app/(board)/board/utilisateurs/_components/user.form"
import { GlobalModal } from "@/components/shared/global.modal"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import type {
  DataTableColumn,
  DataTableRequest,
} from "@/components/shared/core-table/table.types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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

function exportUsers(rows: User[]) {
  if (!rows.length) return
  const content = [
    "Prénom,Nom,E-mail,Téléphone,Rôle,Actif,Super administrateur",
    ...rows.map((user) =>
      [
        user.firstName,
        user.lastName,
        user.email ?? "",
        `${user.indicatif ?? ""}${user.phone ?? ""}`,
        user.role?.name ?? "",
        user.active ? "Oui" : "Non",
        user.isSuperAdmin ? "Oui" : "Non",
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    ),
  ].join("\n")
  const url = URL.createObjectURL(
    new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" })
  )
  const link = document.createElement("a")
  link.href = url
  link.download = "utilisateurs.csv"
  link.click()
  URL.revokeObjectURL(url)
}

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
        id: "identity",
        label: "Utilisateur",
        header: "Utilisateur",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.original.email ?? "Sans e-mail"}
            </div>
          </div>
        ),
      },
      {
        id: "role",
        label: "Rôle",
        header: "Rôle",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.role?.name ?? "Non attribué"}
          </Badge>
        ),
      },
      {
        id: "status",
        label: "Statut",
        header: "Statut",
        cell: ({ row }) => (
          <Badge variant={row.original.active ? "secondary" : "outline"}>
            {row.original.active ? "Actif" : "Inactif"}
          </Badge>
        ),
      },
      {
        id: "verification",
        label: "Vérification",
        header: "Vérification",
        cell: ({ row }) =>
          row.original.emailVerified ? "E-mail vérifié" : "En attente",
      },
      {
        accessorKey: "updatedAt",
        label: "Modification",
        header: "Modification",
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
          <div className="flex justify-end gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Modifier ${user.firstName} ${user.lastName}`}
              onClick={() => {
                setEditing(user)
                setFormOpen(true)
              }}
            >
              <IconEdit />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive"
              aria-label={`Supprimer ${user.firstName} ${user.lastName}`}
              onClick={() => {
                deleteMutation.reset()
                setDeleting(user)
              }}
            >
              <IconTrash />
            </Button>
          </div>
        )}
        bulkActions={({ selectedRows, clearSelection }) => (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportUsers(selectedRows)}
            >
              <IconDownload />
              Exporter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() =>
                void bulkDeleteMutation
                  .mutateAsync(selectedRows.map((user) => user.id))
                  .then(clearSelection)
              }
            >
              <IconTrash />
              Supprimer
            </Button>
          </>
        )}
        export={{
          enabled: true,
          handler: ({ selectedRows, visibleRows }) =>
            exportUsers(selectedRows.length ? selectedRows : visibleRows),
        }}
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
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setDeleting(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte de {deleting?.firstName} {deleting?.lastName} sera
              supprimé définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => void confirmDelete()}
            >
              {deleteMutation.isPending ? <Spinner /> : null}Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
