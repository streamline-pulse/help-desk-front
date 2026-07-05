import type { ApiTimestamp } from "@/types/api/api-data.type"
import type { Country } from "@/types/api/country.type"

export type Region = {
  slug: string
  name: string
  country: Country | null
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}

export type RegionFilters = { countries?: string[] }
