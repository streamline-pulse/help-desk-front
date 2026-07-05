import { IconUsers } from "@tabler/icons-react"

import { UserTable } from "@/app/(board)/utilisateurs/_components/user.table"
import { PageHeader } from "@/components/shared/page/page.header"

export default function UsersPage() {
  return <div className="flex flex-1 flex-col bg-background"><PageHeader label="Administration" title="Utilisateurs" description="Gérez les comptes, les rôles et les niveaux d’accès à la plateforme." icon={IconUsers} /><UserTable /></div>
}
