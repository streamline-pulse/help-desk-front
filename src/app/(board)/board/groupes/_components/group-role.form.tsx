"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { isAppApiError } from "@/lib/api-error"
import { groupRoleSchema, type GroupRoleInput } from "@/schemas/group-role.schema"
import type { GroupModule } from "@/types/api/group-module.type"
import type { GroupPermission } from "@/types/api/group-permission.type"
import type { GroupRole } from "@/types/api/group-role.type"
import { getZodFormErrors, type FormErrors } from "@/utils/form-validation"

type CreateMutation = {
  mutateAsync: (input: GroupRoleInput) => Promise<unknown>
  isPending: boolean
  reset: () => void
}

type UpdateMutation = {
  mutateAsync: (input: {
    id: string
    input: Partial<GroupRoleInput>
  }) => Promise<unknown>
  isPending: boolean
  reset: () => void
}

function rolePermissionsToInput(role: GroupRole): GroupRoleInput["permissionsPerModule"] {
  return role.permissionsPerModule.map((item) => ({
    moduleId: item.module.id,
    permissionId: item.permission.id,
  }))
}

export function GroupRoleForm({
  role,
  modules,
  permissions,
  createMutation,
  updateMutation,
  onClose,
}: {
  role: GroupRole | null
  modules: GroupModule[]
  permissions: GroupPermission[]
  createMutation: CreateMutation
  updateMutation: UpdateMutation
  onClose: () => void
}) {
  const [errors, setErrors] = useState<FormErrors>({})
  const form = useForm({
    defaultValues: {
      name: role?.name ?? "",
      permissionsPerModule:
        role != null ? rolePermissionsToInput(role) : ([] as GroupRoleInput["permissionsPerModule"]),
      global: role?.global ?? false,
    },
    onSubmit: async ({ value }) => {
      const parsed = groupRoleSchema.safeParse(value)
      if (!parsed.success) return setErrors(getZodFormErrors(parsed.error))

      try {
        if (role) {
          await updateMutation.mutateAsync({ id: role.id, input: parsed.data })
        } else {
          await createMutation.mutateAsync(parsed.data)
        }
        close()
      } catch (error) {
        const fieldErrors = isAppApiError(error) ? error.fieldErrors : undefined
        setErrors(
          Object.fromEntries(
            Object.entries(fieldErrors ?? {}).map(([key, messages]) => [
              key,
              messages[0],
            ])
          )
        )
      }
    },
  })
  const pending = createMutation.isPending || updateMutation.isPending

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
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => (
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="group-role-name">Nom du rôle</FieldLabel>
              <Input
                id="group-role-name"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Responsable support"
                aria-invalid={Boolean(errors.name)}
              />
              <FieldError
                errors={errors.name ? [{ message: errors.name }] : undefined}
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="permissionsPerModule">
          {(field) => (
            <Field>
              <FieldLabel>Permissions</FieldLabel>
              <div className="max-h-72 overflow-auto rounded-lg border">
                <div
                  className="grid min-w-max grid-cols-[minmax(11rem,1fr)_repeat(var(--permission-count),minmax(5rem,auto))] border-b bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground"
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
                    className="grid min-w-max grid-cols-[minmax(11rem,1fr)_repeat(var(--permission-count),minmax(5rem,auto))] items-center border-b px-3 py-2 last:border-b-0"
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
                      const checked = field.state.value.some(
                        (item) =>
                          item.moduleId === module.id &&
                          item.permissionId === permission.id
                      )
                      return (
                        <div key={permission.id} className="flex justify-center">
                          <Checkbox
                            aria-label={`${permission.label} — ${module.label}`}
                            checked={checked}
                            onCheckedChange={(value) =>
                              field.handleChange(
                                value === true
                                  ? [
                                      ...field.state.value,
                                      {
                                        moduleId: module.id,
                                        permissionId: permission.id,
                                      },
                                    ]
                                  : field.state.value.filter(
                                      (item) =>
                                        !(
                                          item.moduleId === module.id &&
                                          item.permissionId === permission.id
                                        )
                                    )
                              )
                            }
                          />
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </Field>
          )}
        </form.Field>
      </FieldGroup>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={close}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : null}
          {role ? "Enregistrer" : "Créer le rôle"}
        </Button>
      </DialogFooter>
    </form>
  )
}
