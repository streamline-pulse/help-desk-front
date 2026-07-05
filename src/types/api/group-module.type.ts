import type { ApiTimestamp } from "@/types/api/api-data.type"

export type GroupModule = {
  id: string
  name: string
  label: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}
