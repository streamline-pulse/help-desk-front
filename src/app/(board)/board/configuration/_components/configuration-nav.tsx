"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  configurationMenuResources,
  configurationUi,
} from "@/config/configuration-ui"
import { routes } from "@/config/routes"

export function ConfigurationNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-1 px-6 pb-4" aria-label="Configuration">
      {configurationMenuResources.map((resource) => {
        const href = routes.board.configuration.resource(resource)
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
