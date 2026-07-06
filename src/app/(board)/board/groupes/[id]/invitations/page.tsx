import { GroupDetailSection } from "@/app/(board)/board/groupes/_components/group-detail.section"
import { GroupInvitationTable } from "@/app/(board)/board/groupes/_components/group-invitation.table"

export default async function GroupInvitationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <GroupDetailSection groupId={id} section="invitations">
      <GroupInvitationTable groupId={id} />
    </GroupDetailSection>
  )
}
