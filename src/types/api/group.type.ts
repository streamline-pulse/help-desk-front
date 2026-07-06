import type { ApiTimestamp } from "@/types/api/api-data.type"
import type { GroupType } from "@/types/api/group-type.type"

export type GroupSummary = {
  id: string
  name: string
  logo?: string | null
  logoMiniature?: string | null
}

export type GroupLocation = {
  placeId?: string | null
  name?: string | null
  lat?: string | number | null
  long?: string | number | null
  town?: { slug: string; name: string } | null
}

export type Group = GroupSummary & {
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
  banner?: string | null
  bannerMiniature?: string | null
  description?: string | null
  email?: string | null
  website?: string | null
  parentId?: string | null
  parent?: GroupSummary | null
  children?: GroupSummary[]
  typeId?: string | null
  type?: GroupType | null
  location?: GroupLocation | null
}
