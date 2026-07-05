import { notFound, redirect } from "next/navigation"
import { IconAdjustments } from "@tabler/icons-react"

import { ConfigurationNav } from "@/app/(board)/board/configuration/_components/configuration-nav"
import { ConfigurationResourceTable } from "@/app/(board)/board/configuration/_components/configuration-resource-table"
import { PageHeader } from "@/components/shared/page/page.header"
import {
  configurationMenuResources,
  configurationUi,
} from "@/config/configuration-ui"
import type { ConfigurationResource } from "@/types/configuration-resource.type"
import { routes } from "@/config/routes"

export default async function ConfigurationResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource } = await params
  if (resource === "modules" || resource === "permissions") {
    redirect(routes.board.roles.resource(resource))
  }
  if (!configurationMenuResources.includes(resource as never)) notFound()

  const typedResource = resource as ConfigurationResource
  const ui = configurationUi[typedResource]
  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        label="Configuration"
        title={ui.title}
        description={ui.description}
        icon={IconAdjustments}
      />
      <ConfigurationNav />
      <ConfigurationResourceTable resource={typedResource} />
    </div>
  )
}
