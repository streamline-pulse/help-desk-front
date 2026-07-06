import { GroupResourceSection } from "@/app/(board)/board/groupes/_components/group-resource-section"

export default async function GroupMembersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <GroupResourceSection groupId={id} resource="membres" />
}
