import { BoardLayoutShell } from "@/app/(board)/_components/board-layout-shell"

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <BoardLayoutShell>{children}</BoardLayoutShell>
}
