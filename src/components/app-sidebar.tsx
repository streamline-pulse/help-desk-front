"use client"

import Link from "next/link"
import * as React from "react"

import { NavMain } from "@/components/shared/navigation/nav-main"
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
import { useAuth } from "@/hooks/use-auth"
import { IconHeadset } from "@tabler/icons-react"
import { NavUser } from "./shared/navigation/nav-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session } = useAuth()

  const user = {
    name: session?.email?.split("@")[0] ?? "User",
    email: session?.email ?? "user@example.com",
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
