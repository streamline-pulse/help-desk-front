"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  groupDetailMenuResources,
  groupDetailUi,
  type GroupDetailResource,
} from "@/config/group-ui"
import { routes } from "@/config/routes"

function groupResourceHref(groupId: string, resource: GroupDetailResource) {
  switch (resource) {
    case "roles":
      return routes.board.groups.roles(groupId)
    case "membres":
      return routes.board.groups.members(groupId)
    case "invitations":
      return routes.board.groups.invitations(groupId)
  }
}

export function GroupNav({ groupId }: { groupId: string }) {
  const pathname = usePathname()

  return (
    <nav
      className="flex flex-wrap gap-1 px-6 pb-4"
      aria-label="Gestion du groupe"
    >
      {groupDetailMenuResources.map((resource) => {
        const href = groupResourceHref(groupId, resource)
        return (
          <Button
            key={resource}
            size="sm"
            variant={pathname === href ? "secondary" : "ghost"}
            nativeButton={false}
            render={<Link href={href} />}
          >
            {groupDetailUi[resource].title}
          </Button>
        )
      })}
    </nav>
  )
}
