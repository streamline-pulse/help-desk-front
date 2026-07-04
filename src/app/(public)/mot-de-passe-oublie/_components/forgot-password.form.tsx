"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useForm } from "@tanstack/react-form"

import { AuthFormHeader } from "@/app/(public)/_components/auth-form-header"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { useForgotPasswordMutation } from "@/hooks/queries/use-auth.query"
import { forgotPasswordSchema } from "@/schemas/forgot-password.schema"
import { focusFirstInvalidField, getZodFormErrors, type FormErrors } from "@/utils/form-validation"

const NEUTRAL_MESSAGE = "Si un compte correspond à cette adresse, un message a été envoyé."

export function ForgotPasswordForm() {
  const mutation = useForgotPasswordMutation()
  const errorRef = useRef<HTMLDivElement>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState<string>()
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      const result = forgotPasswordSchema.safeParse(value)
      if (!result.success) {
        const nextErrors = getZodFormErrors(result.error)
        setErrors(nextErrors)
        focusFirstInvalidField(nextErrors)
        return
      }
      try {
        await mutation.mutateAsync(result.data)
        setSuccessMessage(NEUTRAL_MESSAGE)
        setErrors({})
      } catch (error) {
        setErrors({ form: error instanceof Error ? error.message : "Impossible d’envoyer le message." })
        requestAnimationFrame(() => errorRef.current?.focus())
      }
    },
  })

  return (
    <form className="flex flex-col gap-8" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit() }} noValidate aria-busy={mutation.isPending}>
      <AuthFormHeader title="Mot de passe oublié" description="Saisissez votre e-mail pour recevoir un lien de réinitialisation." />
      <FieldGroup>
        {errors.form ? <div ref={errorRef} tabIndex={-1} role="alert"><FieldError errors={[{ message: errors.form }]} /></div> : null}
        {successMessage ? <p role="status" className="text-sm text-muted-foreground">{successMessage}</p> : null}
        <form.Field name="email">{(field) => <Field data-invalid={!!errors.email}><FieldLabel htmlFor="forgot-password-email">E-mail</FieldLabel><Input id="forgot-password-email" name={field.name} type="email" autoComplete="email" required value={field.state.value} onBlur={field.handleBlur} onChange={(event) => { field.handleChange(event.target.value); setErrors({}) }} aria-invalid={!!errors.email} aria-describedby={errors.email ? "forgot-password-email-error" : undefined} /><FieldError id="forgot-password-email-error" errors={errors.email ? [{ message: errors.email }] : undefined} /></Field>}</form.Field>
      </FieldGroup>
      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>{mutation.isPending ? <Spinner /> : null}Envoyer le lien</Button>
        <p className="text-center text-sm text-muted-foreground"><Link href={routes.auth.signIn} className="text-foreground underline-offset-4 hover:underline">Retour à la connexion</Link></p>
      </div>
    </form>
  )
}
