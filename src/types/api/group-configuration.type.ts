import type { ApiTimestamp } from "@/types/api/api-data.type"

export type GroupType = {
  id: string
  name: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}

export type GroupModule = {
  id: string
  name: string
  label: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}

export type GroupPermission = {
  id: string
  name: string
  label: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
}
