import type { ApiTimestamp } from "@/types/api/api-data.type"

export type Module = {
  id: string
  name: string
  label: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}
