"use client"

import { useMemo, useState } from "react"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import type { ResourceMutation } from "@/app/(board)/board/configuration/_components/resource-data.types"
import {
  configurationUi,
  type ConfigurationField,
} from "@/config/configuration-ui"
import { isAppApiError } from "@/lib/api-error"
import { countrySchema } from "@/schemas/country.schema"
import { languageSchema } from "@/schemas/language.schema"
import { moduleSchema } from "@/schemas/module.schema"
import { permissionSchema } from "@/schemas/permission.schema"
import { regionSchema } from "@/schemas/region.schema"
import { roleSchema } from "@/schemas/role.schema"
import { townSchema } from "@/schemas/town.schema"
import {
  groupCapabilitySchema,
  groupTypeSchema,
} from "@/schemas/group-configuration.schema"
import type { Country } from "@/types/api/country.type"
import type { Module } from "@/types/api/module.type"
import type { Permission } from "@/types/api/permission.type"
import type { Region } from "@/types/api/region.type"
import type { Role } from "@/types/api/role.type"
import type { Town } from "@/types/api/town.type"
import type {
  ConfigurationEntity,
  ConfigurationInput,
  ConfigurationResource,
} from "@/types/configuration-resource.type"
import { getZodFormErrors, type FormErrors } from "@/utils/form-validation"

type SelectOption = { value: string; label: string }

type ResourceFormProps = {
  resource: ConfigurationResource
  entity?: ConfigurationEntity | null
  countries: Country[]
  regions: Region[]
  modules: Module[]
  permissions: Permission[]
  createMutation: ResourceMutation<ConfigurationInput>
  updateMutation: ResourceMutation<{
    identifier: string
    input: Partial<ConfigurationInput>
  }>
  onClose: () => void
}

function entityDefaults(
  resource: ConfigurationResource,
  entity?: ConfigurationEntity | null
): ConfigurationInput {
  const base = { name: entity?.name ?? "" }
  if (resource === "languages") {
    return {
      ...base,
      language:
        "language" in (entity ?? {})
          ? String((entity as { language: string }).language)
          : "",
    }
  }
  if (
    resource === "modules" ||
    resource === "permissions" ||
    resource === "group-modules" ||
    resource === "group-permissions"
  ) {
    return {
      ...base,
      label:
        "label" in (entity ?? {})
          ? String((entity as { label: string }).label)
          : "",
    }
  }
  if (resource === "regions") {
    return {
      ...base,
      countrySlug: (entity as Region | undefined)?.country?.slug ?? "",
    }
  }
  if (resource === "towns") {
    return {
      ...base,
      regionSlug: (entity as Town | undefined)?.region?.slug ?? "",
    }
  }
  if (resource === "roles") {
    return {
      ...base,
      permissionsPerModule:
        (entity as Role | undefined)?.permissionsPerModule?.map((item) => ({
          moduleId: item.module.id,
          permissionId: item.permission.id,
        })) ?? [],
    }
  }
  return base
}

function entityIdentifier(
  resource: ConfigurationResource,
  entity: ConfigurationEntity
) {
  return ["countries", "regions", "towns"].includes(resource)
    ? (entity as { slug: string }).slug
    : (entity as { id: string }).id
}

export function ResourceForm({
  resource,
  entity,
  countries,
  regions,
  modules,
  permissions,
  createMutation,
  updateMutation,
  onClose,
}: ResourceFormProps) {
  const ui = configurationUi[resource]
  const fields = ui.fields as readonly ConfigurationField[]
  const mutation = entity ? updateMutation : createMutation
  const [errors, setErrors] = useState<FormErrors>({})
  const defaults = useMemo(
    () => entityDefaults(resource, entity),
    [entity, resource]
  )
  const form = useForm({
    defaultValues: defaults,
    onSubmit: async ({ value }) => {
      const schemas = {
        languages: languageSchema,
        countries: countrySchema,
        regions: regionSchema,
        towns: townSchema,
        modules: moduleSchema,
        permissions: permissionSchema,
        roles: roleSchema,
        "group-types": groupTypeSchema,
        "group-modules": groupCapabilitySchema,
        "group-permissions": groupCapabilitySchema,
      }
      const parsed = schemas[resource].safeParse(value)
      if (!parsed.success) {
        setErrors(getZodFormErrors(parsed.error))
        return
      }
      try {
        if (entity) {
          await updateMutation.mutateAsync({
            identifier: entityIdentifier(resource, entity),
            input: parsed.data,
          })
        } else {
          await createMutation.mutateAsync(parsed.data as ConfigurationInput)
        }
        close()
      } catch (error) {
        const fieldErrors = isAppApiError(error) ? error.fieldErrors : undefined
        setErrors({
          ...Object.fromEntries(
            Object.entries(fieldErrors ?? {}).map(([key, messages]) => [
              key,
              messages[0],
            ])
          ),
        })
      }
    },
  })

  function optionsFor(target?: ConfigurationResource): SelectOption[] {
    if (target === "countries")
      return countries.map((item) => ({ value: item.slug, label: item.name }))
    if (target === "regions")
      return regions.map((item) => ({ value: item.slug, label: item.name }))
    return []
  }

  const pending = mutation.isPending

  function close() {
    form.reset()
    setErrors({})
    createMutation.reset()
    updateMutation.reset()
    onClose()
  }

  return (
    <form
      className="contents"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      noValidate
    >
      <FieldGroup>
        {fields.map((definition) => (
          <form.Field key={definition.name} name={definition.name}>
            {(field) => (
              <Field data-invalid={Boolean(errors[definition.name])}>
                <FieldLabel htmlFor={`resource-${definition.name}`}>
                  {definition.label}
                </FieldLabel>
                {definition.type === "select" ? (
                  <Select
                    value={String(field.state.value ?? "")}
                    onValueChange={(value) =>
                      field.handleChange(String(value ?? ""))
                    }
                  >
                    <SelectTrigger
                      id={`resource-${definition.name}`}
                      className="w-full"
                      aria-invalid={Boolean(errors[definition.name])}
                    >
                      <SelectValue placeholder={definition.placeholder}>
                        {optionsFor(definition.optionsResource).find(
                          (option) =>
                            option.value === String(field.state.value ?? "")
                        )?.label ?? definition.placeholder}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {optionsFor(definition.optionsResource).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={`resource-${definition.name}`}
                    value={String(field.state.value ?? "")}
                    placeholder={definition.placeholder}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={Boolean(errors[definition.name])}
                  />
                )}
                <FieldError
                  errors={
                    errors[definition.name]
                      ? [{ message: errors[definition.name] }]
                      : undefined
                  }
                />
              </Field>
            )}
          </form.Field>
        ))}
        {resource === "roles" ? (
          <form.Field name="permissionsPerModule">
            {(field) => (
              <div className="max-h-72 overflow-y-auto rounded-lg border">
                <div
                  className="grid grid-cols-[minmax(9rem,1fr)_repeat(var(--permission-count),minmax(5rem,auto))] border-b bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground"
                  style={
                    {
                      "--permission-count": permissions.length,
                    } as React.CSSProperties
                  }
                >
                  <span>Module</span>
                  {permissions.map((permission) => (
                    <span key={permission.id} className="text-center">
                      {permission.label}
                    </span>
                  ))}
                </div>
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="grid grid-cols-[minmax(9rem,1fr)_repeat(var(--permission-count),minmax(5rem,auto))] items-center border-b px-3 py-2 last:border-b-0"
                    style={
                      {
                        "--permission-count": permissions.length,
                      } as React.CSSProperties
                    }
                  >
                    <span className="truncate text-sm font-medium">
                      {module.label}
                    </span>
                    {permissions.map((permission) => {
                      const checked = (field.state.value ?? []).some(
                        (item) =>
                          item.moduleId === module.id &&
                          item.permissionId === permission.id
                      )
                      return (
                        <div
                          key={permission.id}
                          className="flex justify-center"
                        >
                          <Checkbox
                            aria-label={`${permission.label} — ${module.label}`}
                            checked={checked}
                            onCheckedChange={(next) => {
                              const current = field.state.value ?? []
                              field.handleChange(
                                next === true
                                  ? [
                                      ...current,
                                      {
                                        moduleId: module.id,
                                        permissionId: permission.id,
                                      },
                                    ]
                                  : current.filter(
                                      (item) =>
                                        item.moduleId !== module.id ||
                                        item.permissionId !== permission.id
                                    )
                              )
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </form.Field>
        ) : null}
      </FieldGroup>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={close}
          disabled={pending}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : null}
          {entity ? "Enregistrer" : "Ajouter"}
        </Button>
      </DialogFooter>
    </form>
  )
}
