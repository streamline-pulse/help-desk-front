import type { Country } from "@/types/api/country.type"
import type { Language } from "@/types/api/language.type"
import type { Module } from "@/types/api/module.type"
import type { Permission } from "@/types/api/permission.type"
import type { Region } from "@/types/api/region.type"
import type { Role } from "@/types/api/role.type"
import type { Town } from "@/types/api/town.type"

export type ConfigurationResource =
  | "languages"
  | "countries"
  | "regions"
  | "towns"
  | "modules"
  | "permissions"
  | "roles"

export type ConfigurationEntity =
  Language | Country | Region | Town | Module | Permission | Role

export type ConfigurationFilters = {
  countries?: string[]
  regions?: string[]
}

export type ConfigurationInput = {
  name: string
  language?: string
  label?: string
  countrySlug?: string
  regionSlug?: string
  permissionsPerModule?: Array<{ moduleId: string; permissionId: string }>
}
