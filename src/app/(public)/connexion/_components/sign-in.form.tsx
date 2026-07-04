"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { AuthFormHeader } from "@/app/(public)/_components/auth-form-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { useSignInMutation } from "@/hooks/queries/use-auth.query"
import { signInSchema, type SignInFormValues } from "@/schemas/sign-in.schema"
import { getSafeCallbackUrl } from "@/utils/auth-redirect"
import {
  focusFirstInvalidField,
  getZodFormErrors,
  type FormErrors,
} from "@/utils/form-validation"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mutation = useSignInMutation()
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"))
  const errorRef = useRef<HTMLDivElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    } as SignInFormValues,
    onSubmit: async ({ value }) => {
      const result = signInSchema.safeParse(value)

      if (!result.success) {
        const nextErrors = getZodFormErrors(result.error)
        setErrors(nextErrors)
        focusFirstInvalidField(nextErrors)
        return
      }

      setErrors({})

      try {
        await mutation.mutateAsync(result.data)
        router.replace(callbackUrl)
        router.refresh()
      } catch (error) {
        setErrors({
          form:
            error instanceof Error
              ? error.message
              : "Impossible de vous connecter.",
        })
        requestAnimationFrame(() => errorRef.current?.focus())
      }
    },
  })

  function clearError(field: string) {
    if (errors[field] || errors.form) {
      setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
    }
  }

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      noValidate
      aria-busy={mutation.isPending}
    >
      <AuthFormHeader title="Connexion" description="Accédez à votre espace Help Desk." />

      <FieldGroup>
        {errors.form ? (
          <div ref={errorRef} tabIndex={-1} role="alert">
            <FieldError errors={[{ message: errors.form }]} />
          </div>
        ) : null}

        <form.Field name="email">
          {(field) => (
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="sign-in-email">E-mail</FieldLabel>
              <Input
                id="sign-in-email"
                name={field.name}
                type="email"
                autoComplete="email"
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value)
                  clearError("email")
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "sign-in-email-error" : undefined}
              />
              <FieldError id="sign-in-email-error" errors={errors.email ? [{ message: errors.email }] : undefined} />
            </Field>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <Field data-invalid={!!errors.password}>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor="sign-in-password">Mot de passe</FieldLabel>
                <Link href={routes.auth.forgotPassword} className="text-sm text-primary underline-offset-4 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="sign-in-password"
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value)
                    clearError("password")
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "sign-in-password-error" : undefined}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton type="button" variant="ghost" size="icon-xs" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} onClick={() => setShowPassword((current) => !current)}>
                    {showPassword ? <IconEyeOff aria-hidden="true" /> : <IconEye aria-hidden="true" />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError id="sign-in-password-error" errors={errors.password ? [{ message: errors.password }] : undefined} />
            </Field>
          )}
        </form.Field>

        <form.Field name="rememberMe">
          {(field) => (
            <div className="flex items-center gap-2.5">
              <Checkbox id="sign-in-remember" checked={field.state.value} onCheckedChange={(checked) => field.handleChange(checked === true)} />
              <label htmlFor="sign-in-remember" className="text-sm">Rester connecté</label>
            </div>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner /> : null}
          Se connecter
        </Button>
        <p className="text-center text-sm text-pretty text-muted-foreground">
          Pas encore de compte ? <Link href={routes.auth.signUp} className="text-foreground underline-offset-4 hover:underline">Créer un compte</Link>
        </p>
      </div>
    </form>
  )
}
