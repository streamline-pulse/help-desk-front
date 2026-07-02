"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { routes } from "@/config/routes"
import { useAuth } from "@/hooks/use-auth"
import {
  IconBook,
  IconChartPie,
  IconFrame,
  IconHeadset,
  IconLifebuoy,
  IconMap,
  IconSend,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { session } = useAuth()

  const user = {
    name: session?.email?.split("@")[0] ?? "User",
    email: session?.email ?? "user@example.com",
    avatar: "",
  }

  const navMain = [
    {
      title: "Employees",
      url: routes.board.employees,
      icon: <IconUsers />,
      isActive: pathname === routes.board.employees,
      items: [
        {
          title: "All employees",
          url: routes.board.employees,
        },
        {
          title: "Departments",
          url: routes.board.employees,
        },
        {
          title: "Positions",
          url: routes.board.employees,
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: <IconBook />,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: routes.settings.root,
      icon: <IconSettings />,
      items: [
        {
          title: "General",
          url: routes.settings.general,
        },
        {
          title: "Security",
          url: routes.settings.security,
        },
      ],
    },
  ]

  const navSecondary = [
    {
      title: "Support",
      url: "#",
      icon: <IconLifebuoy />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <IconSend />,
    },
  ]

  const projects = [
    {
      name: "Help Desk",
      url: routes.board.root,
      icon: <IconHeadset />,
    },
    {
      name: "Statistics",
      url: routes.statistics.all,
      icon: <IconChartPie />,
    },
    {
      name: "Teams",
      url: routes.teams.all,
      icon: <IconMap />,
    },
    {
      name: "Requests",
      url: routes.requests.all,
      icon: <IconFrame />,
    },
  ]

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
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
