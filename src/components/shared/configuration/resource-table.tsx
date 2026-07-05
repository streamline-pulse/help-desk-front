import { CountryTable } from "@/components/shared/configuration/country.table"
import { LanguageTable } from "@/components/shared/configuration/language.table"
import { ModuleTable } from "@/components/shared/configuration/module.table"
import { PermissionTable } from "@/components/shared/configuration/permission.table"
import { RegionTable } from "@/components/shared/configuration/region.table"
import { RoleTable } from "@/components/shared/configuration/role.table"
import { TownTable } from "@/components/shared/configuration/town.table"
import type { ConfigurationResource } from "@/types/configuration-resource.type"

export function ResourceTable({
  resource,
}: {
  resource: ConfigurationResource
}) {
  if (resource === "languages") return <LanguageTable />
  if (resource === "countries") return <CountryTable />
  if (resource === "regions") return <RegionTable />
  if (resource === "towns") return <TownTable />
  if (resource === "modules") return <ModuleTable />
  if (resource === "permissions") return <PermissionTable />
  return <RoleTable />
}
