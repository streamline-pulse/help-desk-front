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
  profileSecuritySchema,
  type ProfileSecurityInput,
} from "@/schemas/profile.schema"
import type { AuthUser } from "@/types/api/user.type"
import { getZodFormErrors, type FormErrors } from "@/utils/form-validation"

type Mutation = {
  mutateAsync: (input: {
    id: string
    input: ProfileSecurityInput
  }) => Promise<unknown>
  isPending: boolean
  reset: () => void
}

export function ProfileSecurityForm({
  user,
  mutation,
}: {
  user: AuthUser
  mutation: Mutation
}) {
  const [errors, setErrors] = useState<FormErrors>({})
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = profileSecuritySchema.safeParse(value)
      if (!parsed.success) {
        setErrors(getZodFormErrors(parsed.error))
        return
      }

      try {
        await mutation.mutateAsync({ id: user.id, input: parsed.data })
        form.reset()
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
        <CardTitle>Sécurité</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
        >
          <form.Field name="currentPassword">
            {(field) => (
              <Field data-invalid={Boolean(errors.currentPassword)}>
                <FieldLabel htmlFor="profile-current-password">
                  Mot de passe actuel
                </FieldLabel>
                <Input
                  id="profile-current-password"
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(errors.currentPassword)}
                />
                <FieldError
                  errors={
                    errors.currentPassword
                      ? [{ message: errors.currentPassword }]
                      : undefined
                  }
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="newPassword">
            {(field) => (
              <Field data-invalid={Boolean(errors.newPassword)}>
                <FieldLabel htmlFor="profile-new-password">
                  Nouveau mot de passe
                </FieldLabel>
                <Input
                  id="profile-new-password"
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(errors.newPassword)}
                />
                <FieldError
                  errors={
                    errors.newPassword
                      ? [{ message: errors.newPassword }]
                      : undefined
                  }
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
          Mettre à jour
        </Button>
      </CardFooter>
    </Card>
  )
}
