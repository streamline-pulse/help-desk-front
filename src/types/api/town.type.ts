import type { ApiTimestamp } from "@/types/api/api-data.type"
import type { Region } from "@/types/api/region.type"

export type Town = {
  slug: string
  name: string
  region: Region | null
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}

export type TownFilters = { regions?: string[] }
