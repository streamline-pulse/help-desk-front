import type { ApiTimestamp } from "@/types/api/api-data.type"

export type Language = {
  id: string
  name: string
  language: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}
