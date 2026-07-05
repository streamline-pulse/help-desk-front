import { CountryTable } from "@/app/(board)/board/configuration/_components/country.table"
import { LanguageTable } from "@/app/(board)/board/configuration/_components/language.table"
import { RegionTable } from "@/app/(board)/board/configuration/_components/region.table"
import { TownTable } from "@/app/(board)/board/configuration/_components/town.table"
import type { ConfigurationResource } from "@/types/configuration-resource.type"

export function ConfigurationResourceTable({
  resource,
}: {
  resource: ConfigurationResource
}) {
  if (resource === "languages") return <LanguageTable />
  if (resource === "countries") return <CountryTable />
  if (resource === "regions") return <RegionTable />
  if (resource === "towns") return <TownTable />
  return null
}
