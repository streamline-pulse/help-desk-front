"use client"

import { useMemo, useState } from "react"
import {
  IconChevronDown,
  IconClock,
  IconLink,
  IconMail,
  IconMailPlus,
  IconShield,
  IconToggleRight,
} from "@tabler/icons-react"

import { GroupInvitationDetailPanel } from "@/app/(board)/board/groupes/_components/group-invitation.detail.panel"
import { GroupInvitationForm } from "@/app/(board)/board/groupes/_components/group-invitation.form"
import { GroupInvitationLinkForm } from "@/app/(board)/board/groupes/_components/group-invitation-link.form"
import {
  buildRowActions,
  TableActionsCell,
} from "@/components/shared/core-table/cells/actions.cell"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { DetailTriggerCell } from "@/components/shared/core-table/cells/detail-trigger.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import { TableColumnHeader } from "@/components/shared/core-table/table.column-header"
import { TableDetailDrawer } from "@/components/shared/core-table/table.detail-drawer"
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation.modal"
import { GlobalModal } from "@/components/shared/global.modal"
import type {
  DataTableColumn,
  DataTableFilter,
  DataTableRequest,
} from "@/components/shared/core-table/table.types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTableDetail } from "@/hooks/use-table-detail"
import {
  useCreateGroupInvitationMutation,
  useDeleteGroupInvitationMutation,
  useGroupInvitationListQuery,
} from "@/hooks/queries/use-group-invitation.query"
import { useGroupRoleListQuery } from "@/hooks/queries/use-group-role.query"
import { useCurrentGroupUserQuery } from "@/hooks/queries/use-group-user.query"
import type { PageResult } from "@/types/api/api-data.type"
import type {
  GroupInvitation,
  GroupInvitationStatus,
} from "@/types/api/group-invitation.type"
import { hasGroupPermission } from "@/utils/group-permissions"

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

function invitationLabel(invitation: GroupInvitation) {
  return invitation.email ?? "Lien partageable"
}

export function GroupInvitationTable({ groupId }: { groupId: string }) {
  const [formOpen, setFormOpen] = useState(false)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [deleting, setDeleting] = useState<GroupInvitation | null>(null)
  const detail = useTableDetail<GroupInvitation>()
  const openDetail = detail.openDetail
  const rolesQuery = useGroupRoleListQuery(groupId, listRequest)
  const currentGroupUserQuery = useCurrentGroupUserQuery(groupId)
  const createMutation = useCreateGroupInvitationMutation(groupId)
  const deleteMutation = useDeleteGroupInvitationMutation(groupId)
  const roles = rolesQuery.data?.rows ?? []
  const hasRoles = roles.length > 0
  const canCreateInvitations = hasGroupPermission(
    currentGroupUserQuery.data?.user,
    "groups-users-invitations",
    "create"
  )
  const canDeleteInvitations = hasGroupPermission(
    currentGroupUserQuery.data?.user,
    "groups-users-invitations",
    "delete"
  )

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
        exportValue: invitationLabel,
        cell: ({ row }) => (
          <DetailTriggerCell
            label={invitationLabel(row.original)}
            onClick={() => openDetail(row.original)}
          >
            <TextCell
              value={invitationLabel(row.original)}
              variant="primary"
            />
          </DetailTriggerCell>
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
    [openDetail]
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

  function getRowActions(invitation: GroupInvitation) {
    return buildRowActions({
      label: invitationLabel(invitation),
      onDelete: canDeleteInvitations
        ? () => {
            deleteMutation.reset()
            setDeleting(invitation)
          }
        : undefined,
      deleteLabel: `Supprimer ${invitationLabel(invitation)}`,
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
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={!hasRoles || !canCreateInvitations}
              render={
                <Button size="sm" disabled={!hasRoles || !canCreateInvitations}>
                  <IconMailPlus />
                  Inviter
                  <IconChevronDown data-icon="inline-end" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => setFormOpen(true)}>
                <IconMail />
                Par e-mail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLinkModalOpen(true)}>
                <IconLink />
                Générer un lien
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        rowActions={(invitation) => (
          <TableActionsCell actions={getRowActions(invitation)} />
        )}
        export={{ enabled: true, filename: `groupe-${groupId}-invitations` }}
        ariaLabel="Invitations du groupe"
      />
      <TableDetailDrawer
        open={detail.open}
        onOpenChange={detail.onOpenChange}
        title={detail.item ? invitationLabel(detail.item) : "Invitation"}
        description="Consultez le statut et les informations de cette invitation."
        actions={detail.item ? getRowActions(detail.item) : undefined}
      >
        {detail.item ? (
          <GroupInvitationDetailPanel invitation={detail.item} />
        ) : null}
      </TableDetailDrawer>
      <GlobalModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Inviter un membre"
        description="Choisissez une adresse e-mail et le rôle attribué lors de l’acceptation."
        preventClose={createMutation.isPending}
      >
        <GroupInvitationForm
          roles={roles}
          mutation={createMutation}
          onClose={() => setFormOpen(false)}
        />
      </GlobalModal>
      <GlobalModal
        open={linkModalOpen}
        onOpenChange={setLinkModalOpen}
        title="Générer un lien d’invitation"
        description="Sélectionnez le rôle attribué lors de l’acceptation, puis partagez le lien généré."
        contentClassName="sm:max-w-lg"
        preventClose={false}
      >
        <GroupInvitationLinkForm
          key={linkModalOpen ? "open" : "closed"}
          groupId={groupId}
          roles={roles}
          onClose={() => setLinkModalOpen(false)}
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
