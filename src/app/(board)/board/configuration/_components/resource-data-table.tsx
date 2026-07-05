"use client"

import { useMemo, useState } from "react"
import {
  IconDownload,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"

import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { CustomCell } from "@/components/shared/core-table/cells/custom.cell"
import { NumberCell } from "@/components/shared/core-table/cells/number.cell"
import { RelationCell } from "@/components/shared/core-table/cells/relation.cell"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import type {
  DataTableColumn,
  DataTableFilter,
  DataTableRequest,
} from "@/components/shared/core-table/table.types"
import type {
  ResourceDataHooks,
  ResourceMutation,
} from "@/app/(board)/board/configuration/_components/resource-data.types"
import { ResourceForm } from "@/app/(board)/board/configuration/_components/resource.form"
import { GlobalModal } from "@/components/shared/global.modal"
import { configurationUi } from "@/config/configuration-ui"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
        cell: ({ row }) => (
          <RelationCell value={(row.original as Town).region?.name} />
        ),
      },
      {
        id: "country",
        label: "Pays",
        header: "Pays",
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
        cell: ({ row }) => (
          <NumberCell value={(row.original as Role)._count?.users ?? 0} />
        ),
      },
      {
        id: "permissions",
        label: "Droits",
        header: "Droits",
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

function RowActions({
  entity,
  onEdit,
  onDelete,
}: {
  entity: ConfigurationEntity
  onEdit: (entity: ConfigurationEntity) => void
  onDelete: (entity: ConfigurationEntity) => void
}) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Modifier ${entity.name}`}
        onClick={() => onEdit(entity)}
      >
        <IconEdit />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:text-destructive"
        aria-label={`Supprimer ${entity.name}`}
        onClick={() => onDelete(entity)}
      >
        <IconTrash />
      </Button>
    </div>
  )
}

function exportRows(
  rows: ConfigurationEntity[],
  resource: ConfigurationResource
) {
  if (rows.length === 0) return
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))].filter(
    (key) => !["permissionsPerModule", "_count"].includes(key)
  )
  const serialize = (value: unknown) => {
    if (typeof value === "object" && value !== null) {
      if ("name" in value) return String(value.name)
      return JSON.stringify(value)
    }
    return String(value ?? "")
  }
  const content = [
    keys.join(","),
    ...rows.map((row) =>
      keys
        .map(
          (key) =>
            `"${serialize((row as unknown as Record<string, unknown>)[key]).replaceAll('"', '""')}"`
        )
        .join(",")
    ),
  ].join("\n")
  const url = URL.createObjectURL(
    new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" })
  )
  const link = document.createElement("a")
  link.href = url
  link.download = `${resource}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function BulkActions({
  resource,
  rows,
  clearSelection,
  mutation,
}: {
  resource: ConfigurationResource
  rows: ConfigurationEntity[]
  clearSelection: () => void
  mutation: ResourceMutation<string[]>
}) {
  const [open, setOpen] = useState(false)

  async function removeSelected() {
    try {
      await mutation.mutateAsync(rows.map((row) => identifier(resource, row)))
      clearSelection()
      setOpen(false)
    } catch {
      // The mutation error remains visible in the confirmation dialog.
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => exportRows(rows, resource)}
      >
        <IconDownload />
        Exporter
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
        onClick={() => {
          mutation.reset()
          setOpen(true)
        }}
      >
        <IconTrash />
        Supprimer
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!mutation.isPending) setOpen(next)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la sélection ?</AlertDialogTitle>
            <AlertDialogDescription>
              {`${rows.length} élément${rows.length > 1 ? "s" : ""} seront supprimés définitivement.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={mutation.isPending}
              onClick={() => void removeSelected()}
            >
              {mutation.isPending ? <Spinner /> : null}Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
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
          <RowActions
            entity={entity}
            onEdit={(current) => setFormState({ open: true, entity: current })}
            onDelete={(current) => {
              deleteMutation.reset()
              setDeleting(current)
            }}
          />
        )}
        bulkActions={({ selectedRows, clearSelection }) => (
          <BulkActions
            resource={resource}
            rows={selectedRows}
            clearSelection={clearSelection}
            mutation={bulkDeleteMutation}
          />
        )}
        export={{
          enabled: true,
          handler: ({ selectedRows, visibleRows }) =>
            exportRows(
              selectedRows.length > 0 ? selectedRows : visibleRows,
              resource
            ),
        }}
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
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setDeleting(null)
            deleteMutation.reset()
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer {ui.singular} ?</AlertDialogTitle>
            <AlertDialogDescription>
              {`« ${deleting?.name ?? ""} » sera supprimé définitivement.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => void confirmDelete()}
            >
              {deleteMutation.isPending ? <Spinner /> : null}Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
