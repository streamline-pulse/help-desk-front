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

function groupResourceHref(
  groupId: string,
  resource: GroupDetailResource,
  mode: "admin" | "group-space"
) {
  if (mode === "group-space") {
    switch (resource) {
      case "roles":
        return routes.board.groupSpace.roles
      case "membres":
        return routes.board.groupSpace.members
      case "invitations":
        return routes.board.groupSpace.invitations
      case "fichiers":
        return routes.board.groupSpace.files
    }
  }

  switch (resource) {
    case "roles":
      return routes.board.groups.roles(groupId)
    case "membres":
      return routes.board.groups.members(groupId)
    case "invitations":
      return routes.board.groups.invitations(groupId)
    case "fichiers":
      return routes.board.groups.files(groupId)
  }
}

export function GroupNav({
  groupId,
  mode = "admin",
}: {
  groupId: string
  mode?: "admin" | "group-space"
}) {
  const pathname = usePathname()

  return (
    <nav
      className="flex flex-wrap gap-1 px-6 pb-4"
      aria-label="Gestion du groupe"
    >
      {groupDetailMenuResources.map((resource) => {
        const href = groupResourceHref(groupId, resource, mode)
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
