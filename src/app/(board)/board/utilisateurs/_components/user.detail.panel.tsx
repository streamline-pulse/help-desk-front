"use client"

import { BooleanCell } from "@/components/shared/core-table/cells/boolean.cell"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { CustomCell } from "@/components/shared/core-table/cells/custom.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { LinkCell } from "@/components/shared/core-table/cells/link.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import type { User } from "@/types/api/user.type"

type DetailFieldProps = {
  label: string
  children: React.ReactNode
}

function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div className="grid gap-1.5">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function UserDetailPanel({ user }: { user: User }) {
  const fullName = `${user.firstName} ${user.lastName}`.trim()

  return (
    <dl className="grid gap-5">
      <DetailField label="Nom complet">
        <TextCell value={fullName} variant="primary" />
      </DetailField>
      <DetailField label="E-mail">
        <LinkCell
          href={user.email ? `mailto:${user.email}` : null}
          value={user.email}
          fallback="Sans e-mail"
        />
      </DetailField>
      <DetailField label="Téléphone">
        <CustomCell
          variant="phone"
          indicatif={user.indicatif}
          phone={user.phone}
          fallback="Sans téléphone"
        />
      </DetailField>
      <DetailField label="Rôle">
        <BadgeCell
          value={user.role?.name}
          variant="outline"
          fallback="Non attribué"
        />
      </DetailField>
      <DetailField label="Statut">
        <BooleanCell value={user.active} preset="active" />
      </DetailField>
      <DetailField label="Vérification e-mail">
        <BooleanCell value={user.emailVerified} preset="verified" />
      </DetailField>
      <DetailField label="Super administrateur">
        <BooleanCell
          value={user.isSuperAdmin}
          trueLabel="Oui"
          falseLabel="Non"
          trueTone="warning"
          falseTone="neutral"
        />
      </DetailField>
      <DetailField label="Dernière modification">
        <DateCell value={user.updatedAt} relativeUntilDays={3} />
      </DetailField>
    </dl>
  )
}
