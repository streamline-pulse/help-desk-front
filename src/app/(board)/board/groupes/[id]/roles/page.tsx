import { GroupRoleTable } from "@/app/(board)/board/groupes/_components/group-role.table"

export default async function GroupRolesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <GroupRoleTable groupId={id} />
}
