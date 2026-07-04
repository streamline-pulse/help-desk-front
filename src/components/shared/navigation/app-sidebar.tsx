"use client"

import Link from "next/link"
import * as React from "react"

import { NavMain } from "@/components/shared/navigation/nav-main"
import { NavUser } from "@/components/shared/navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { navigationItems } from "@/config/navigation-items"
import { routes } from "@/config/routes"
import { useCurrentUserQuery } from "@/hooks/queries/use-auth.query"
import { IconHeadset } from "@tabler/icons-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useCurrentUserQuery()

  const navigationUser = {
    name: user ? `${user.firstName} ${user.lastName}`.trim() : "Utilisateur",
    email: user?.email ?? "",
    avatar: "",
  }

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={routes.board.root} />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <IconHeadset />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Help Desk CCMT</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigationUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
