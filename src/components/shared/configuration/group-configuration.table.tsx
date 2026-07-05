"use client"

import { ResourceDataTable } from "@/components/shared/configuration/resource-data-table"
import type { ResourceDataHooks } from "@/components/shared/configuration/resource-data.types"
import { createGroupConfigurationHooks } from "@/hooks/queries/use-group-configuration.query"

export type GroupConfigurationResource =
  "group-types" | "group-modules" | "group-permissions"

const hooks = {
  "group-types": createGroupConfigurationHooks("group-types"),
  "group-modules": createGroupConfigurationHooks("group-modules"),
  "group-permissions": createGroupConfigurationHooks("group-permissions"),
}

export function GroupConfigurationTable({
  resource,
}: {
  resource: GroupConfigurationResource
}) {
  return (
    <ResourceDataTable
      resource={resource}
      hooks={hooks[resource] as unknown as ResourceDataHooks}
    />
  )
}
