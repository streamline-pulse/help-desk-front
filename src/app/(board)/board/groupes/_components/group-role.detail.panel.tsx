"use client"

import { BooleanCell } from "@/components/shared/core-table/cells/boolean.cell"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import type { GroupRole } from "@/types/api/group-role.type"

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

export function GroupRoleDetailPanel({ role }: { role: GroupRole }) {
  return (
    <dl className="grid gap-5">
      <DetailField label="Nom">
        <TextCell value={role.name} variant="primary" />
      </DetailField>
      <DetailField label="Portée">
        <BadgeCell
          value={role.global ? "Global" : "Groupe"}
          variant="secondary"
        />
      </DetailField>
      <DetailField label="Modifiable">
        <BooleanCell
          value={role.editable}
          trueLabel="Oui"
          falseLabel="Non"
          trueTone="neutral"
          falseTone="neutral"
        />
      </DetailField>
      <DetailField label="Permissions">
        {role.permissionsPerModule.length ? (
          <ul className="grid gap-2">
            {role.permissionsPerModule.map((entry) => (
              <li
                key={`${entry.module.id}-${entry.permission.id}`}
                className="flex flex-wrap items-center gap-2 text-sm"
              >
                <BadgeCell value={entry.module.label} variant="outline" />
                <span className="text-muted-foreground">·</span>
                <BadgeCell value={entry.permission.label} variant="secondary" />
              </li>
            ))}
          </ul>
        ) : (
          <TextCell value={null} fallback="Aucune permission" variant="muted" />
        )}
      </DetailField>
      <DetailField label="Création">
        <DateCell value={role.createdAt} relativeUntilDays={3} />
      </DetailField>
      <DetailField label="Dernière modification">
        <DateCell value={role.updatedAt} relativeUntilDays={3} />
      </DetailField>
    </dl>
  )
}
