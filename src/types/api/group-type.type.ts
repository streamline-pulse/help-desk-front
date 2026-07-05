import type { ApiTimestamp } from "@/types/api/api-data.type"

export type GroupType = {
  id: string
  name: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}
