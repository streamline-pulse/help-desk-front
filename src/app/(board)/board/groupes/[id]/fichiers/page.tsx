import { GroupDetailSection } from "@/app/(board)/board/groupes/_components/group-detail.section"
import { GroupFileTable } from "@/app/(board)/board/groupes/_components/group-file.table"

export default async function GroupFilesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <GroupDetailSection groupId={id} section="fichiers">
      <GroupFileTable groupId={id} />
    </GroupDetailSection>
  )
}
