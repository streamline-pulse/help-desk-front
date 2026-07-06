"use client"

import { useState } from "react"
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
import { isAppApiError } from "@/lib/api-error"
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/schemas/user.schema"
import type { Role } from "@/types/api/role.type"
import type { User } from "@/types/api/user.type"
import { onboardingEvents, emitOnboardingEvent } from "@/lib/onboarding-events"
import { getZodFormErrors, type FormErrors } from "@/utils/form-validation"

type Mutation<T> = {
  mutateAsync: (input: T) => Promise<unknown>
  isPending: boolean
  reset: () => void
}

export function UserForm({
  user,
  roles,
  createMutation,
  updateMutation,
  onClose,
}: {
  user: User | null
  roles: Role[]
  createMutation: Mutation<CreateUserInput>
  updateMutation: Mutation<{ id: string; input: UpdateUserInput }>
  onClose: () => void
}) {
  const [errors, setErrors] = useState<FormErrors>({})
  const form = useForm({
    defaultValues: {
      email: user?.email ?? "",
      password: "",
      lastName: user?.lastName ?? "",
      firstName: user?.firstName ?? "",
      roleId: user?.roleId ?? "",
      phone: user?.phone ?? "",
      indicatif: user?.indicatif ?? "",
      active: user?.active ?? true,
      isSuperAdmin: user?.isSuperAdmin ?? false,
    },
    onSubmit: async ({ value }) => {
      const schema = user ? updateUserSchema : createUserSchema
      const candidate = user
        ? {
            email: value.email,
            lastName: value.lastName,
            firstName: value.firstName,
            roleId: value.roleId,
            phone: value.phone,
            indicatif: value.indicatif,
            active: value.active,
            isSuperAdmin: value.isSuperAdmin,
          }
        : value
      const parsed = schema.safeParse(candidate)
      if (!parsed.success) {
        setErrors(getZodFormErrors(parsed.error))
        return
      }
      try {
        if (user) {
          await updateMutation.mutateAsync({
            id: user.id,
            input: parsed.data as UpdateUserInput,
          })
        } else {
          await createMutation.mutateAsync(parsed.data as CreateUserInput)
          emitOnboardingEvent(onboardingEvents.userCreated)
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

  const fields: ReadonlyArray<{
    name:
      | "firstName"
      | "lastName"
      | "email"
      | "password"
      | "indicatif"
      | "phone"
    label: string
    type: "text" | "email" | "password" | "tel"
    placeholder: string
  }> = [
    { name: "firstName", label: "Prénom", type: "text", placeholder: "Afi" },
    { name: "lastName", label: "Nom", type: "text", placeholder: "Mensah" },
    {
      name: "email",
      label: "Adresse e-mail",
      type: "email",
      placeholder: "afi@example.com",
    },
    ...(!user
      ? ([
          {
            name: "password",
            label: "Mot de passe",
            type: "password",
            placeholder: "6 caractères minimum",
          },
        ] as const)
      : []),
    {
      name: "indicatif",
      label: "Indicatif",
      type: "text",
      placeholder: "+228",
    },
    { name: "phone", label: "Téléphone", type: "tel", placeholder: "90000000" },
  ]

  return (
    <form
      className="contents"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        {fields.map((definition) => (
          <form.Field key={definition.name} name={definition.name}>
            {(field) => (
              <Field data-invalid={Boolean(errors[definition.name])}>
                <FieldLabel htmlFor={`user-${definition.name}`}>
                  {definition.label}
                </FieldLabel>
                <Input
                  id={`user-${definition.name}`}
                  type={definition.type}
                  value={String(field.state.value)}
                  placeholder={definition.placeholder}
                  aria-invalid={Boolean(errors[definition.name])}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
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
        <form.Field name="roleId">
          {(field) => (
            <Field
              className="sm:col-span-2"
              data-invalid={Boolean(errors.roleId)}
            >
              <FieldLabel>Rôle</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(String(value ?? ""))
                }
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={Boolean(errors.roleId)}
                >
                  <SelectValue placeholder="Sélectionner un rôle">
                    {roles.find((role) => role.id === field.state.value)
                      ?.name ?? "Sélectionner un rôle"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={
                  errors.roleId ? [{ message: errors.roleId }] : undefined
                }
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="active">
          {(field) => (
            <Field orientation="horizontal">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(value) => field.handleChange(value === true)}
              />
              <FieldLabel>Compte actif</FieldLabel>
            </Field>
          )}
        </form.Field>
        <form.Field name="isSuperAdmin">
          {(field) => (
            <Field orientation="horizontal">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(value) => field.handleChange(value === true)}
              />
              <FieldLabel>Super administrateur</FieldLabel>
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
          {user ? "Enregistrer" : "Ajouter"}
        </Button>
      </DialogFooter>
    </form>
  )
}
