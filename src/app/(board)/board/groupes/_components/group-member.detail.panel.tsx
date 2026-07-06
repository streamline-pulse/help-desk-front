"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { CustomCell } from "@/components/shared/core-table/cells/custom.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { LinkCell } from "@/components/shared/core-table/cells/link.cell"
import { RelationCell } from "@/components/shared/core-table/cells/relation.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { Skeleton } from "@/components/ui/skeleton"
import { useGroupUserDetailQuery } from "@/hooks/queries/use-group-user.query"
import type { GroupUser } from "@/types/api/group-user.type"

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

export function GroupMemberDetailPanel({ member }: { member: GroupUser }) {
  const memberQuery = useGroupUserDetailQuery(member.groupId, member.userId)
  const detail = memberQuery.data?.user

  if (memberQuery.isPending) {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    )
  }

  if (!detail) {
    return (
      <Alert>
        <AlertTitle>Membre introuvable</AlertTitle>
        <AlertDescription>
          Le détail de ce membre n’est pas disponible pour le moment.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <dl className="grid gap-5">
      <DetailField label="Nom complet">
        <TextCell
          value={`${detail.firstName} ${detail.lastName}`.trim()}
          variant="primary"
        />
      </DetailField>
      <DetailField label="E-mail">
        <LinkCell
          href={detail.email ? `mailto:${detail.email}` : null}
          value={detail.email}
          fallback="Sans e-mail"
        />
      </DetailField>
      <DetailField label="Téléphone">
        <CustomCell
          variant="phone"
          indicatif={detail.indicatif}
          phone={detail.phone}
          fallback="Sans téléphone"
        />
      </DetailField>
      <DetailField label="Rôle dans le groupe">
        <BadgeCell value={detail.role.name} variant="outline" />
      </DetailField>
      <DetailField label="Groupe">
        <RelationCell value={member.group.name} variant="primary" />
      </DetailField>
      <DetailField label="Ajouté le">
        <DateCell value={detail.createdAt} relativeUntilDays={3} />
      </DetailField>
      <DetailField label="Dernière modification">
        <DateCell value={detail.updatedAt} relativeUntilDays={3} />
      </DetailField>
    </dl>
  )
}
