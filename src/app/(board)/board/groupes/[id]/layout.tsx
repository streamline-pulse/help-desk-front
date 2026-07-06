import { GroupDetailLayout } from "@/app/(board)/board/groupes/_components/group-detail.layout"

export default async function GroupDetailRootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <GroupDetailLayout groupId={id}>{children}</GroupDetailLayout>
}
