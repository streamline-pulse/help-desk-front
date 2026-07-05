import type { ApiTimestamp } from "@/types/api/api-data.type"
import type { Module } from "@/types/api/module.type"
import type { Permission } from "@/types/api/permission.type"

export type RolePermission = {
  module: Module
  permission: Permission
}

export type Role = {
  id: string
  name: string
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
  _count?: { users: number }
  permissionsPerModule?: RolePermission[]
}
