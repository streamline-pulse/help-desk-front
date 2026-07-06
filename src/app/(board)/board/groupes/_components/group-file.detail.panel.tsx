"use client"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { useGroupFileQuery } from "@/hooks/queries/use-file.query"
import type { FileEntity } from "@/types/api/file.type"
import { IconFileDescription } from "@tabler/icons-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

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

function formatFileSize(size: number | null) {
  if (size == null) return "Taille inconnue"
  if (size < 1024) return `${size} o`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`
}

export function GroupFileDetailPanel({
  groupId,
  file,
}: {
  groupId: string
  file: FileEntity
}) {
  const fileQuery = useGroupFileQuery(groupId, file.id)
  const detail = fileQuery.data

  if (fileQuery.isPending) {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    )
  }

  if (!detail) {
    return (
      <Alert>
        <AlertTitle>Fichier introuvable</AlertTitle>
        <AlertDescription>
          Impossible de charger le détail de ce fichier.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <dl className="grid gap-5">
      <Attachment className="w-full">
        <AttachmentMedia>
          <IconFileDescription />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{detail.name}</AttachmentTitle>
          <AttachmentDescription>
            {detail.fileType} • {formatFileSize(detail.size)}
          </AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <DetailField label="Nom">
        <TextCell value={detail.name} variant="primary" />
      </DetailField>
      <DetailField label="Type MIME">
        <TextCell value={detail.type} />
      </DetailField>
      <DetailField label="Extension">
        <TextCell value={detail.extension} />
      </DetailField>
      <DetailField label="Taille">
        <TextCell value={formatFileSize(detail.size)} />
      </DetailField>
      <DetailField label="Chemin">
        <TextCell value={detail.path} />
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
