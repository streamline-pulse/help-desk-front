import type { ApiTimestamp } from "@/types/api/api-data.type"

export type Country = {
  slug: string
  name: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}
