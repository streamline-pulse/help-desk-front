"use client"

import { useMemo, useState } from "react"
import {
  IconClock,
  IconMail,
  IconMailPlus,
  IconShield,
  IconToggleRight,
} from "@tabler/icons-react"

import { GroupInvitationForm } from "@/app/(board)/board/groupes/_components/group-invitation.form"
import { GroupInvitationLinkCard } from "@/app/(board)/board/groupes/_components/group-invitation-link.card"
import { TableActionsCell } from "@/components/shared/core-table/cells/actions.cell"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import { TableColumnHeader } from "@/components/shared/core-table/table.column-header"
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation.modal"
import { GlobalModal } from "@/components/shared/global.modal"
import type {
  DataTableColumn,
  DataTableFilter,
  DataTableRequest,
} from "@/components/shared/core-table/table.types"
import { Button } from "@/components/ui/button"
import { groupDetailUi } from "@/config/group-ui"
import {
  useCreateGroupInvitationMutation,
  useDeleteGroupInvitationMutation,
  useGroupInvitationListQuery,
} from "@/hooks/queries/use-group-invitation.query"
import { useGroupRoleListQuery } from "@/hooks/queries/use-group-role.query"
import type { PageResult } from "@/types/api/api-data.type"
import type {
  GroupInvitation,
  GroupInvitationStatus,
} from "@/types/api/group-invitation.type"

type InvitationFilters = {
  status?: GroupInvitationStatus
}

const listRequest = { page: 1, perPage: 100, filters: {} }

const statusOptions = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "Actives" },
  { value: "accepted", label: "Acceptées" },
  { value: "expired", label: "Expirées" },
] as const

function invitationStatus(invitation: GroupInvitation) {
  if (invitation.accepted) return "Acceptée"
  if (new Date(invitation.expirationDate).getTime() < Date.now()) return "Expirée"
  return "Active"
}

export function GroupInvitationTable({ groupId }: { groupId: string }) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<GroupInvitation | null>(null)
  const rolesQuery = useGroupRoleListQuery(groupId, listRequest)
  const createMutation = useCreateGroupInvitationMutation(groupId)
  const deleteMutation = useDeleteGroupInvitationMutation(groupId)
  const ui = groupDetailUi.invitations

  const filters = useMemo<DataTableFilter<InvitationFilters>[]>(
    () => [
      {
        key: "status",
        type: "select",
        label: "Statut",
        placeholder: "Toutes",
        options: statusOptions.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      },
    ],
    []
  )

  const columns = useMemo<DataTableColumn<GroupInvitation>[]>(
    () => [
      {
        id: "recipient",
        label: "Destinataire",
        header: () => (
          <TableColumnHeader icon={IconMail}>Destinataire</TableColumnHeader>
        ),
        exportValue: (invitation) =>
          invitation.email ?? "Lien partageable",
        cell: ({ row }) => (
          <TextCell
            value={row.original.email ?? "Lien partageable"}
            variant="primary"
          />
        ),
      },
      {
        id: "role",
        label: "Rôle",
        header: () => (
          <TableColumnHeader icon={IconShield}>Rôle</TableColumnHeader>
        ),
        exportValue: (invitation) => invitation.role.name,
        cell: ({ row }) => (
          <BadgeCell value={row.original.role.name} variant="outline" />
        ),
      },
      {
        id: "status",
        label: "Statut",
        header: () => (
          <TableColumnHeader icon={IconToggleRight}>Statut</TableColumnHeader>
        ),
        exportValue: invitationStatus,
        cell: ({ row }) => (
          <BadgeCell
            value={invitationStatus(row.original)}
            variant="secondary"
          />
        ),
      },
      {
        accessorKey: "expirationDate",
        label: "Expiration",
        header: () => (
          <TableColumnHeader icon={IconClock}>Expiration</TableColumnHeader>
        ),
        cell: ({ row }) => (
          <DateCell
            value={row.original.expirationDate}
            relativeUntilDays={3}
          />
        ),
      },
    ],
    []
  )

  function useInvitationsQuery(request: DataTableRequest<InvitationFilters>) {
    const rawStatus = request.filters.status
    const status: GroupInvitationStatus =
      rawStatus === "active" ||
      rawStatus === "accepted" ||
      rawStatus === "expired"
        ? rawStatus
        : "all"
    return useGroupInvitationListQuery(groupId, status, request)
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
      <div className="grid gap-4 px-6 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-balance">{ui.title}</h2>
          <p className="text-sm text-pretty text-muted-foreground">
            {ui.description}
          </p>
        </div>
        <GroupInvitationLinkCard
          groupId={groupId}
          roles={rolesQuery.data?.rows ?? []}
        />
      </div>
      <DataTable<
        GroupInvitation,
        GroupInvitation,
        InvitationFilters,
        PageResult<GroupInvitation>
      >
        id={`group-${groupId}-invitations`}
        query={useInvitationsQuery}
        responseAdapter={(response) => response}
        columns={columns}
        filters={filters}
        getRowId={(invitation) => invitation.id}
        defaultPageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        search={{
          enabled: true,
          placeholder: "Rechercher une invitation…",
          debounceMs: 400,
        }}
        capabilities={{
          pagination: true,
          search: true,
          filters: true,
          serverSorting: false,
        }}
        toolbarActions={
          <Button
            size="sm"
            disabled={!rolesQuery.data?.rows.length}
            onClick={() => setFormOpen(true)}
          >
            <IconMailPlus />
            Inviter par e-mail
          </Button>
        }
        rowActions={(invitation) => (
          <TableActionsCell
            label={invitation.email ?? "cette invitation"}
            onDelete={() => {
              deleteMutation.reset()
              setDeleting(invitation)
            }}
          />
        )}
        export={{ enabled: true, filename: `groupe-${groupId}-invitations` }}
        ariaLabel="Invitations du groupe"
      />
      <GlobalModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Inviter un membre"
        description="Choisissez une adresse e-mail et le rôle attribué lors de l’acceptation."
        preventClose={createMutation.isPending}
      >
        <GroupInvitationForm
          roles={rolesQuery.data?.rows ?? []}
          mutation={createMutation}
          onClose={() => setFormOpen(false)}
        />
      </GlobalModal>
      <DeleteConfirmationModal
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setDeleting(null)
        }}
        level="simple"
        title="Supprimer cette invitation ?"
        description="Le lien associé ne pourra plus être utilisé."
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
