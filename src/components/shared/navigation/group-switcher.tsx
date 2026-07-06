"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isGroupSpacePathname } from "@/config/board-breadcrumbs"
import { routes } from "@/config/routes"
import { useCurrentGroup } from "@/hooks/use-current-group"
import { useCurrentGroupUserQuery } from "@/hooks/queries/use-group-user.query"
import { IconCheck, IconChevronDown, IconHeadset, IconUsersGroup } from "@tabler/icons-react"

function getAdminGroupDestination(pathname: string, groupId: string) {
  const adminGroupMatch = pathname.match(/^\/board\/groupes\/[^/]+(?:\/([^/]+))?$/)
  const section = adminGroupMatch?.[1]

  switch (section) {
    case "membres":
      return routes.board.groups.members(groupId)
    case "invitations":
      return routes.board.groups.invitations(groupId)
    case "fichiers":
      return routes.board.groups.files(groupId)
    case "roles":
    default:
      return routes.board.groups.roles(groupId)
  }
}

export function GroupSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    groups,
    currentGroup,
    setSelectedGroupId,
    isPending,
  } = useCurrentGroup()
  const currentGroupUserQuery = useCurrentGroupUserQuery(currentGroup?.id ?? "")

  const hasGroups = groups.length > 0
  const title = currentGroup?.name ?? "Sélectionner un groupe"
  const subtitle = currentGroupUserQuery.data?.user?.role.name
    ? `Role : ${currentGroupUserQuery.data.user.role.name}`
    : hasGroups
      ? "Role indisponible"
      : "Aucun groupe"

  function handleSelectGroup(groupId: string) {
    if (groupId === currentGroup?.id) {
      return
    }

    setSelectedGroupId(groupId)

    if (isGroupSpacePathname(pathname)) {
      return
    }

    if (pathname.startsWith(`${routes.board.groups.root}/`)) {
      router.push(getAdminGroupDestination(pathname, groupId))
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-muted aria-expanded:text-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <IconHeadset />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {isPending ? "Chargement…" : title}
              </span>
              <span className="truncate text-xs">{subtitle}</span>
            </div>
            <IconChevronDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-72 rounded-lg">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Changer de groupe</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {hasGroups ? (
              groups.map((group) => {
                const isCurrent = group.id === currentGroup?.id

                return (
                  <DropdownMenuItem
                    key={group.id}
                    onClick={() => handleSelectGroup(group.id)}
                  >
                    <IconUsersGroup />
                    <span className="flex-1 truncate">{group.name}</span>
                    {isCurrent ? <IconCheck className="size-4" /> : null}
                  </DropdownMenuItem>
                )
              })
            ) : (
              <DropdownMenuItem disabled>Aucun groupe disponible</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href={routes.board.groups.root} />}>
              <IconUsersGroup />
              Voir tous les groupes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
