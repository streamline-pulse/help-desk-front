"use client"

import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { LinkCell } from "@/components/shared/core-table/cells/link.cell"
import { RelationCell } from "@/components/shared/core-table/cells/relation.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import type { GroupInvitation } from "@/types/api/group-invitation.type"

function DetailField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function invitationStatus(invitation: GroupInvitation) {
  if (invitation.accepted) return "Acceptée"
  if (new Date(invitation.expirationDate).getTime() < Date.now()) return "Expirée"
  return "Active"
}

function inviterName(invitation: GroupInvitation) {
  return `${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`.trim()
}

export function GroupInvitationDetailPanel({
  invitation,
}: {
  invitation: GroupInvitation
}) {
  return (
    <dl className="grid gap-5">
      <DetailField label="Destinataire">
        <TextCell
          value={invitation.email ?? "Lien partageable"}
          variant="primary"
        />
      </DetailField>
      <DetailField label="E-mail accepté">
        <LinkCell
          href={
            invitation.acceptedEmail
              ? `mailto:${invitation.acceptedEmail}`
              : null
          }
          value={invitation.acceptedEmail}
          fallback="Non renseigné"
        />
      </DetailField>
      <DetailField label="Rôle proposé">
        <BadgeCell value={invitation.role.name} variant="outline" />
      </DetailField>
      <DetailField label="Statut">
        <BadgeCell
          value={invitationStatus(invitation)}
          variant="secondary"
        />
      </DetailField>
      <DetailField label="Expiration">
        <DateCell value={invitation.expirationDate} relativeUntilDays={3} />
      </DetailField>
      <DetailField label="Invité par">
        <RelationCell value={inviterName(invitation)} />
      </DetailField>
      <DetailField label="Groupe">
        <RelationCell value={invitation.group.name} variant="primary" />
      </DetailField>
      <DetailField label="Création">
        <DateCell value={invitation.createdAt} relativeUntilDays={3} />
      </DetailField>
      <DetailField label="Dernière modification">
        <DateCell value={invitation.updatedAt} relativeUntilDays={3} />
      </DetailField>
    </dl>
  )
}
