import { notFound } from "next/navigation"
import { IconCategory } from "@tabler/icons-react"

import { GroupConfigurationNav } from "@/app/(board)/board/group-configuration/_components/group-configuration-nav"
import {
  GroupConfigurationTable,
  type GroupConfigurationResource,
} from "@/app/(board)/board/group-configuration/_components/group-configuration.table"
import { PageHeader } from "@/components/shared/page/page.header"
import {
  configurationUi,
  groupConfigurationMenuResources,
} from "@/config/configuration-ui"

export default async function GroupConfigurationResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource } = await params
  if (!groupConfigurationMenuResources.includes(resource as never)) notFound()
  const typedResource = resource as GroupConfigurationResource
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
      <GroupConfigurationTable resource={typedResource} />
    </div>
  )
}
