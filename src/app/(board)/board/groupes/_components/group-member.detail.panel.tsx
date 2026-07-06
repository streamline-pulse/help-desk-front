"use client"

import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { CustomCell } from "@/components/shared/core-table/cells/custom.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { LinkCell } from "@/components/shared/core-table/cells/link.cell"
import { RelationCell } from "@/components/shared/core-table/cells/relation.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
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

function memberFullName(member: GroupUser) {
  return `${member.user.firstName} ${member.user.lastName}`.trim()
}

export function GroupMemberDetailPanel({ member }: { member: GroupUser }) {
  return (
    <dl className="grid gap-5">
      <DetailField label="Nom complet">
        <TextCell value={memberFullName(member)} variant="primary" />
      </DetailField>
      <DetailField label="E-mail">
        <LinkCell
          href={member.user.email ? `mailto:${member.user.email}` : null}
          value={member.user.email}
          fallback="Sans e-mail"
        />
      </DetailField>
      <DetailField label="Téléphone">
        <CustomCell
          variant="phone"
          indicatif={member.user.indicatif}
          phone={member.user.phone}
          fallback="Sans téléphone"
        />
      </DetailField>
      <DetailField label="Rôle dans le groupe">
        <BadgeCell value={member.role.name} variant="outline" />
      </DetailField>
      <DetailField label="Groupe">
        <RelationCell value={member.group.name} variant="primary" />
      </DetailField>
      <DetailField label="Ajouté le">
        <DateCell value={member.createdAt} relativeUntilDays={3} />
      </DetailField>
      <DetailField label="Dernière modification">
        <DateCell value={member.updatedAt} relativeUntilDays={3} />
      </DetailField>
    </dl>
  )
}
