import { ModuleTable } from "@/app/(board)/board/roles/_components/module.table"
import { PermissionTable } from "@/app/(board)/board/roles/_components/permission.table"
import type { ConfigurationResource } from "@/types/configuration-resource.type"

export function AccessControlResourceTable({
  resource,
}: {
  resource: ConfigurationResource
}) {
  if (resource === "modules") return <ModuleTable />
  if (resource === "permissions") return <PermissionTable />
  return null
}
