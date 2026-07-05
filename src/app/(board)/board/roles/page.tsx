import { IconShieldLock } from "@tabler/icons-react"

import { AccessControlNav } from "@/app/(board)/board/roles/_components/access-control-nav"
import { RoleTable } from "@/app/(board)/board/roles/_components/role.table"
import { PageHeader } from "@/components/shared/page/page.header"
import { configurationUi } from "@/config/configuration-ui"

export default function RolesPage() {
  const ui = configurationUi.roles
  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        label="Rôles et permissions"
        title={ui.title}
        description={ui.description}
        icon={IconShieldLock}
      />
      <AccessControlNav />
      <RoleTable />
    </div>
  )
}
