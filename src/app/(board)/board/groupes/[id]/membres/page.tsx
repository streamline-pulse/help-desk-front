import { GroupDetailSection } from "@/app/(board)/board/groupes/_components/group-detail.section"
import { GroupMemberTable } from "@/app/(board)/board/groupes/_components/group-member.table"

export default async function GroupMembersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <GroupDetailSection groupId={id} section="membres">
      <GroupMemberTable groupId={id} />
    </GroupDetailSection>
  )
}
