import { IconUsersGroup } from "@tabler/icons-react"

import { GroupTable } from "@/app/(board)/board/groupes/_components/group.table"
import { PageHeader } from "@/components/shared/page/page.header"

export default function GroupsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        label="Organisation"
        title="Groupes"
        description="Créez les organisations et ouvrez leur espace pour gérer rôles, membres et invitations."
        icon={IconUsersGroup}
      />
      <GroupTable />
    </div>
  )
}
