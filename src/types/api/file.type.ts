import type { ApiTimestamp } from "@/types/api/api-data.type"

export type FileEntity = {
  id: string
  name: string
  description: string | null
  path: string
  extension: string
  type: string
  fileType: string
  size: number | null
  ownerId: string | null
  groupId: string | null
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}
