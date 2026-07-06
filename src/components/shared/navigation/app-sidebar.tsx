"use client"

import * as React from "react"

import { GroupSwitcher } from "@/components/shared/navigation/group-switcher"
import { NavMain } from "@/components/shared/navigation/nav-main"
import { NavUser } from "@/components/shared/navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { navigationItems } from "@/config/navigation-items"
import { useCurrentUserQuery } from "@/hooks/queries/use-auth.query"

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
        <GroupSwitcher />
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
