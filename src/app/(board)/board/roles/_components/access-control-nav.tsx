"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  accessControlMenuResources,
  configurationUi,
} from "@/config/configuration-ui"
import { routes } from "@/config/routes"

export function AccessControlNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex flex-wrap gap-1 px-6 pb-4"
      aria-label="Rôles et permissions"
    >
      {accessControlMenuResources.map((resource) => {
        const href =
          resource === "roles"
            ? routes.board.roles.root
            : routes.board.roles.resource(resource)
        return (
          <Button
            key={resource}
            size="sm"
            variant={pathname === href ? "secondary" : "ghost"}
            nativeButton={false}
            render={<Link href={href} />}
          >
            {configurationUi[resource].title}
          </Button>
        )
      })}
    </nav>
  )
}
