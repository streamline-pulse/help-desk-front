import { notFound } from "next/navigation"
import { IconShieldLock } from "@tabler/icons-react"

import { AccessControlNav } from "@/components/shared/configuration/access-control-nav"
import { ResourceTable } from "@/components/shared/configuration/resource-table"
import { PageHeader } from "@/components/shared/page/page.header"
import {
  accessControlMenuResources,
  configurationUi,
} from "@/config/configuration-ui"
import type { ConfigurationResource } from "@/types/configuration-resource.type"

export default async function AccessControlResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource } = await params
  if (
    resource === "roles" ||
    !accessControlMenuResources.includes(resource as never)
  ) {
    notFound()
  }

  const typedResource = resource as ConfigurationResource
  const ui = configurationUi[typedResource]
  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        label="Rôles et permissions"
        title={ui.title}
        description={ui.description}
        icon={IconShieldLock}
      />
      <AccessControlNav />
      <ResourceTable resource={typedResource} />
    </div>
  )
}
