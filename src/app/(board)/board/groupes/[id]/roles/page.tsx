import { GroupDetailSection } from "@/app/(board)/board/groupes/_components/group-detail.section"
import { GroupRoleTable } from "@/app/(board)/board/groupes/_components/group-role.table"

export default async function GroupRolesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <GroupDetailSection groupId={id} section="roles">
      <GroupRoleTable groupId={id} />
    </GroupDetailSection>
  )
}
