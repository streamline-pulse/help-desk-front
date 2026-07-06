"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { isAppApiError } from "@/lib/api-error"
import {
  profileInformationSchema,
  type ProfileInformationInput,
} from "@/schemas/profile.schema"
import type { AuthUser } from "@/types/api/user.type"
import { getZodFormErrors, type FormErrors } from "@/utils/form-validation"

type Mutation = {
  mutateAsync: (input: {
    id: string
    input: ProfileInformationInput
  }) => Promise<unknown>
  isPending: boolean
  reset: () => void
}

export function ProfileInformationForm({
  user,
  mutation,
}: {
  user: AuthUser
  mutation: Mutation
}) {
  const [errors, setErrors] = useState<FormErrors>({})
  const form = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email ?? "",
      indicatif: user.indicatif ?? "",
      phone: user.phone ?? "",
    },
    onSubmit: async ({ value }) => {
      const parsed = profileInformationSchema.safeParse(value)
      if (!parsed.success) {
        setErrors(getZodFormErrors(parsed.error))
        return
      }

      try {
        await mutation.mutateAsync({ id: user.id, input: parsed.data })
        setErrors({})
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
        >
          <form.Field name="firstName">
            {(field) => (
              <Field data-invalid={Boolean(errors.firstName)}>
                <FieldLabel htmlFor="profile-first-name">Prénom</FieldLabel>
                <Input
                  id="profile-first-name"
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(errors.firstName)}
                />
                <FieldError
                  errors={
                    errors.firstName
                      ? [{ message: errors.firstName }]
                      : undefined
                  }
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="lastName">
            {(field) => (
              <Field data-invalid={Boolean(errors.lastName)}>
                <FieldLabel htmlFor="profile-last-name">Nom</FieldLabel>
                <Input
                  id="profile-last-name"
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(errors.lastName)}
                />
                <FieldError
                  errors={
                    errors.lastName
                      ? [{ message: errors.lastName }]
                      : undefined
                  }
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <Field className="sm:col-span-2" data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="profile-email">Adresse e-mail</FieldLabel>
                <Input
                  id="profile-email"
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                />
                <FieldError
                  errors={errors.email ? [{ message: errors.email }] : undefined}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="indicatif">
            {(field) => (
              <Field data-invalid={Boolean(errors.indicatif)}>
                <FieldLabel htmlFor="profile-indicatif">Indicatif</FieldLabel>
                <Input
                  id="profile-indicatif"
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(errors.indicatif)}
                />
                <FieldError
                  errors={
                    errors.indicatif
                      ? [{ message: errors.indicatif }]
                      : undefined
                  }
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="phone">
            {(field) => (
              <Field data-invalid={Boolean(errors.phone)}>
                <FieldLabel htmlFor="profile-phone">Téléphone</FieldLabel>
                <Input
                  id="profile-phone"
                  name={field.name}
                  type="tel"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                />
                <FieldError
                  errors={errors.phone ? [{ message: errors.phone }] : undefined}
                />
              </Field>
            )}
          </form.Field>
          <button type="submit" className="hidden" />
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={mutation.isPending}
          onClick={() => {
            form.reset()
            mutation.reset()
            setErrors({})
          }}
        >
          Réinitialiser
        </Button>
        <Button
          type="button"
          disabled={mutation.isPending}
          onClick={() => void form.handleSubmit()}
        >
          {mutation.isPending ? <Spinner /> : null}
          Enregistrer
        </Button>
      </CardFooter>
    </Card>
  )
}
