"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  isNavigationLinkItem,
  type NavigationItem,
  type NavigationLinkItem,
} from "@/config/navigation-items"
import { IconLock } from "@tabler/icons-react"

export function NavMain({
  items,
}: {
  items: readonly NavigationItem[]
}) {
  const pathname = usePathname()
  const activeItem = items
    .filter(isNavigationLinkItem)
    .reduce<NavigationLinkItem | undefined>(
    (currentActiveItem, item) => {
      const matchesPathname =
        pathname === item.url ||
        (item.url !== "/" && pathname.startsWith(`${item.url}/`))

      if (!matchesPathname) {
        return currentActiveItem
      }

      if (!currentActiveItem || item.url.length > currentActiveItem.url.length) {
        return item
      }

      return currentActiveItem
    },
    undefined
  )

  return (
    <SidebarGroup data-onboarding="sidebar-navigation">
      <SidebarMenu>
        {items.map((item) => {
          if (!isNavigationLinkItem(item)) {
            return (
              <SidebarMenuItem key={item.id}>
                <div className="px-2 pt-4 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                  {item.title}
                </div>
              </SidebarMenuItem>
            )
          }

          const Icon = item.icon
          const isActive = item.moduleCode === activeItem?.moduleCode

          return (
            <SidebarMenuItem key={item.moduleCode}>
              {item.isReady ? (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  render={<Link href={item.url} />}
                >
                  <Icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  disabled
                  aria-label={`${item.title} — bientôt disponible`}
                  tooltip={`${item.title} — bientôt disponible`}
                  className="pr-9 opacity-50"
                >
                  <Icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
              {!item.isReady && (
                <SidebarMenuBadge aria-hidden="true">
                  <IconLock className="size-3.5" />
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
