"use client"

import { AppSidebar } from "@/components/shared/navigation/app-sidebar"
import { SiteHeader } from "@/components/shared/navigation/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

type BoardSidebarLayoutProps = {
  children: React.ReactNode
}

export function BoardSidebarLayout({ children }: BoardSidebarLayoutProps) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
