"use client"

import { useMemo, useState } from "react"
import { IconPlus } from "@tabler/icons-react"

import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { TableActionsCell } from "@/components/shared/core-table/cells/actions.cell"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { CustomCell } from "@/components/shared/core-table/cells/custom.cell"
import { NumberCell } from "@/components/shared/core-table/cells/number.cell"
import { RelationCell } from "@/components/shared/core-table/cells/relation.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import {
  DeleteConfirmationModal,
  type DeleteConfirmationLevel,
} from "@/components/shared/delete-confirmation.modal"
import type {
  DataTableColumn,
  DataTableFilter,
  DataTableRequest,
} from "@/components/shared/core-table/table.types"
import type {
  ResourceDataHooks,
} from "@/app/(board)/board/configuration/_components/resource-data.types"
import { ResourceForm } from "@/app/(board)/board/configuration/_components/resource.form"
import { GlobalModal } from "@/components/shared/global.modal"
import { configurationUi } from "@/config/configuration-ui"
import { Button } from "@/components/ui/button"
import { useCountryListQuery } from "@/hooks/queries/use-country.query"
import { useModuleListQuery } from "@/hooks/queries/use-module.query"
import { usePermissionListQuery } from "@/hooks/queries/use-permission.query"
import { useRegionListQuery } from "@/hooks/queries/use-region.query"
import type { ApiListParams, PageResult } from "@/types/api/api-data.type"
import type { Country } from "@/types/api/country.type"
import type { Module } from "@/types/api/module.type"
import type { Permission } from "@/types/api/permission.type"
import type { Region } from "@/types/api/region.type"
import type { Role } from "@/types/api/role.type"
import type { Town } from "@/types/api/town.type"
import type {
  ConfigurationEntity,
  ConfigurationFilters,
  ConfigurationResource,
} from "@/types/configuration-resource.type"

function identifier(
  resource: ConfigurationResource,
  entity: ConfigurationEntity
) {
  return ["countries", "regions", "towns"].includes(resource)
    ? (entity as { slug: string }).slug
    : (entity as { id: string }).id
}

function singleDeleteLevel(
  resource: ConfigurationResource
): DeleteConfirmationLevel {
  if (resource === "roles") return "match"
  if (
    resource === "modules" ||
    resource === "permissions" ||
    resource === "group-modules" ||
    resource === "group-permissions"
  ) {
    return "confirm"
  }
  return "simple"
}

function columnsFor(
  resource: ConfigurationResource
): DataTableColumn<ConfigurationEntity>[] {
  const name: DataTableColumn<ConfigurationEntity> = {
    accessorKey: "name",
    label: "Nom",
    header: "Nom",
    cell: ({ row }) => <TextCell value={row.original.name} variant="primary" />,
  }
  const updatedAt: DataTableColumn<ConfigurationEntity> = {
    accessorKey: "updatedAt",
    label: "Modification",
    header: "Modification",
    cell: ({ row }) => (
      <DateCell value={row.original.updatedAt} relativeUntilDays={3} />
    ),
  }

  if (resource === "languages") {
    return [
      name,
      {
        accessorKey: "language",
        label: "Code",
        header: "Code",
        cell: ({ row }) => (
          <CustomCell
            variant="code"
            value={(row.original as { language: string }).language}
          />
        ),
      },
      updatedAt,
    ]
  }
  if (
    resource === "modules" ||
    resource === "permissions" ||
    resource === "group-modules" ||
    resource === "group-permissions"
  ) {
    return [
      {
        accessorKey: "label",
        label: "Libellé",
        header: "Libellé",
        cell: ({ row }) => (
          <TextCell value={(row.original as Module).label} variant="primary" />
        ),
      },
      {
        accessorKey: "name",
        label: "Code",
        header: "Code",
        cell: ({ row }) => <CustomCell variant="code" value={row.original.name} />,
      },
      updatedAt,
    ]
  }
  if (resource === "regions") {
    return [
      name,
      {
        id: "country",
        label: "Pays",
        header: "Pays",
        exportValue: (row) => (row as Region).country?.name ?? "",
        cell: ({ row }) => (
          <RelationCell value={(row.original as Region).country?.name} />
        ),
      },
      updatedAt,
    ]
  }
  if (resource === "towns") {
    return [
      name,
      {
        id: "region",
        label: "Région",
        header: "Région",
        exportValue: (row) => (row as Town).region?.name ?? "",
        cell: ({ row }) => (
          <RelationCell value={(row.original as Town).region?.name} />
        ),
      },
      {
        id: "country",
        label: "Pays",
        header: "Pays",
        exportValue: (row) => (row as Town).region?.country?.name ?? "",
        cell: ({ row }) => (
          <RelationCell value={(row.original as Town).region?.country?.name} />
        ),
      },
      updatedAt,
    ]
  }
  if (resource === "roles") {
    return [
      name,
      {
        id: "users",
        label: "Utilisateurs",
        header: "Utilisateurs",
        exportValue: (row) =>
          String((row as Role)._count?.users ?? 0),
        cell: ({ row }) => (
          <NumberCell value={(row.original as Role)._count?.users ?? 0} />
        ),
      },
      {
        id: "permissions",
        label: "Droits",
        header: "Droits",
        exportValue: (row) =>
          String((row as Role).permissionsPerModule?.length ?? 0),
        cell: ({ row }) => (
          <BadgeCell
            value={(row.original as Role).permissionsPerModule?.length ?? 0}
            variant="secondary"
          />
        ),
      },
      updatedAt,
    ]
  }
  return [
    name,
    {
      accessorKey: "slug",
      label: "Identifiant",
      header: "Identifiant",
      cell: ({ row }) => (
        <TextCell
          value={(row.original as { slug: string }).slug}
          variant="mono"
        />
      ),
    },
    updatedAt,
  ]
}

export function ResourceDataTable({
  resource,
  hooks,
}: {
  resource: ConfigurationResource
  hooks: ResourceDataHooks
}) {
  const ui = configurationUi[resource]
  const [formState, setFormState] = useState<{
    open: boolean
    entity: ConfigurationEntity | null
  }>({ open: false, entity: null })
  const [deleting, setDeleting] = useState<ConfigurationEntity | null>(null)
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useDelete()
  const bulkDeleteMutation = hooks.useBulkDelete()
  const dependencyRequest: ApiListParams<ConfigurationFilters> = {
    page: 1,
    perPage: 100,
    filters: {},
  }
  const countriesQuery = useCountryListQuery(
    dependencyRequest,
    resource === "regions"
  )
  const regionsQuery = useRegionListQuery(
    dependencyRequest,
    resource === "towns"
  )
  const modulesQuery = useModuleListQuery(
    dependencyRequest,
    resource === "roles"
  )
  const permissionsQuery = usePermissionListQuery(
    dependencyRequest,
    resource === "roles"
  )
  const countries = useMemo(
    () => countriesQuery.data?.rows ?? [],
    [countriesQuery.data?.rows]
  )
  const regions = useMemo(
    () => regionsQuery.data?.rows ?? [],
    [regionsQuery.data?.rows]
  )
  const modules = modulesQuery.data?.rows ?? []
  const permissions = permissionsQuery.data?.rows ?? []
  const columns = useMemo(() => columnsFor(resource), [resource])
  const filters = useMemo<DataTableFilter<ConfigurationFilters>[]>(() => {
    if (resource === "regions")
      return [
        {
          key: "countries",
          type: "multi-select",
          label: "Pays",
          options: countries.map((item) => ({
            value: item.slug,
            label: item.name,
          })),
        },
      ]
    if (resource === "towns")
      return [
        {
          key: "regions",
          type: "multi-select",
          label: "Régions",
          options: regions.map((item) => ({
            value: item.slug,
            label: item.name,
          })),
        },
      ]
    return []
  }, [countries, regions, resource])

  function useResourceQuery(request: DataTableRequest<ConfigurationFilters>) {
    return hooks.useList(request)
  }

  async function confirmDelete() {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(identifier(resource, deleting))
      setDeleting(null)
    } catch {
      // The mutation error remains visible in the confirmation dialog.
    }
  }

  return (
    <>
      <DataTable<
        ConfigurationEntity,
        ConfigurationEntity,
        ConfigurationFilters,
        PageResult<ConfigurationEntity>
      >
        id={`configuration-${resource}`}
        query={useResourceQuery}
        responseAdapter={(response) => response}
        columns={columns}
        filters={filters}
        getRowId={(entity) => identifier(resource, entity)}
        defaultPageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        search={{
          enabled: true,
          placeholder: `Rechercher ${ui.singular}…`,
          debounceMs: 400,
        }}
        capabilities={{
          pagination: true,
          search: true,
          filters: filters.length > 0,
          serverSorting: false,
        }}
        selectable
        toolbarActions={
          <Button
            size="sm"
            onClick={() => setFormState({ open: true, entity: null })}
          >
            <IconPlus />
            Ajouter
          </Button>
        }
        rowActions={(entity) => (
          <TableActionsCell
            label={entity.name}
            onEdit={() => setFormState({ open: true, entity })}
            onDelete={() => {
              deleteMutation.reset()
              setDeleting(entity)
            }}
          />
        )}
        bulkDelete={{
          level: "confirm",
          isPending: bulkDeleteMutation.isPending,
          onReset: () => bulkDeleteMutation.reset(),
          onDelete: async (rows) => {
            await bulkDeleteMutation.mutateAsync(
              rows.map((row) => identifier(resource, row))
            )
          },
        }}
        export={{ enabled: true, filename: resource }}
        ariaLabel={`Liste des ${ui.title.toLocaleLowerCase("fr")}`}
      />
      <GlobalModal
        open={formState.open}
        onOpenChange={(open) =>
          setFormState((current) => ({
            open,
            entity: open ? current.entity : null,
          }))
        }
        title={
          <>
            {formState.entity ? "Modifier" : "Ajouter"}{" "}
            {configurationUi[resource].singular}
          </>
        }
        description={
          formState.entity
            ? "Mettez à jour les informations de cette ressource."
            : "Renseignez les informations de la nouvelle ressource."
        }
        contentClassName={resource === "roles" ? "sm:max-w-2xl" : undefined}
        preventClose={createMutation.isPending || updateMutation.isPending}
      >
        <ResourceForm
          key={`${resource}-${formState.entity ? identifier(resource, formState.entity) : "new"}`}
          resource={resource}
          entity={formState.entity}
          countries={countries as Country[]}
          regions={regions as Region[]}
          modules={modules as Module[]}
          permissions={permissions as Permission[]}
          createMutation={createMutation}
          updateMutation={updateMutation}
          onClose={() =>
            setFormState({ open: false, entity: null })
          }
        />
      </GlobalModal>
      <DeleteConfirmationModal
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setDeleting(null)
            deleteMutation.reset()
          }
        }}
        level={singleDeleteLevel(resource)}
        itemName={deleting?.name}
        matchValue={resource === "roles" ? deleting?.name : undefined}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
