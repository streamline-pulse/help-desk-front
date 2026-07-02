import { BoardLayoutShell } from "@/app/(board)/_components/board-layout-shell"
import { BoardSidebarLayout } from "@/app/(board)/_components/board-sidebar-layout"

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <BoardLayoutShell>
      <BoardSidebarLayout>{children}</BoardSidebarLayout>
    </BoardLayoutShell>
  )
}
