import { notFound } from "next/navigation"
import { IconCategory } from "@tabler/icons-react"

import { GroupConfigurationNav } from "@/components/shared/configuration/group-configuration-nav"
import { ResourceTable } from "@/components/shared/configuration/resource-table"
import { PageHeader } from "@/components/shared/page/page.header"
import {
  configurationUi,
  groupConfigurationMenuResources,
} from "@/config/configuration-ui"
import type { ConfigurationResource } from "@/types/configuration-resource.type"

export default async function GroupConfigurationResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource } = await params
  if (!groupConfigurationMenuResources.includes(resource as never)) notFound()
  const typedResource = resource as ConfigurationResource
  const ui = configurationUi[typedResource]
  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        label="Configuration des groupes"
        title={ui.title}
        description={ui.description}
        icon={IconCategory}
      />
      <GroupConfigurationNav />
      <ResourceTable resource={typedResource} />
    </div>
  )
}
