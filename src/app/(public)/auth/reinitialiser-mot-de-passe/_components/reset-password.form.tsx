"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { AuthFormHeader } from "@/app/(public)/auth/_components/auth-form-header"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { useResetPasswordMutation } from "@/hooks/queries/use-auth.query"
import { resetPasswordSchema } from "@/schemas/reset-password.schema"
import { focusFirstInvalidField, getZodFormErrors, type FormErrors } from "@/utils/form-validation"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mutation = useResetPasswordMutation()
  const errorRef = useRef<HTMLDivElement>(null)
  const resetToken = searchParams.get("resetToken")?.trim() ?? ""
  const [errors, setErrors] = useState<FormErrors>({})
  const [visible, setVisible] = useState({ password: false, confirmation: false })
  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    onSubmit: async ({ value }) => {
      if (!resetToken) {
        setErrors({ form: "Le lien de réinitialisation est incomplet ou invalide." })
        requestAnimationFrame(() => errorRef.current?.focus())
        return
      }
      const result = resetPasswordSchema.safeParse(value)
      if (!result.success) {
        const nextErrors = getZodFormErrors(result.error)
        setErrors(nextErrors)
        focusFirstInvalidField(nextErrors)
        return
      }
      try {
        await mutation.mutateAsync({ resetToken, password: result.data.password, logOutDevices: true })
        router.replace(`${routes.auth.signIn}?reset=success`)
        router.refresh()
      } catch (error) {
        setErrors({ form: error instanceof Error ? error.message : "Impossible de réinitialiser le mot de passe." })
        requestAnimationFrame(() => errorRef.current?.focus())
      }
    },
  })

  const passwordField = (name: "password" | "confirmPassword", label: string, shown: boolean, toggle: () => void) => (
    <form.Field name={name}>{(field) => <Field data-invalid={!!errors[name]}><FieldLabel htmlFor={`reset-${name}`}>{label}</FieldLabel><InputGroup><InputGroupInput id={`reset-${name}`} name={field.name} type={shown ? "text" : "password"} autoComplete="new-password" required value={field.state.value} onBlur={field.handleBlur} onChange={(event) => { field.handleChange(event.target.value); setErrors((current) => ({ ...current, [name]: undefined, form: undefined })) }} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `reset-${name}-error` : undefined} /><InputGroupAddon align="inline-end"><InputGroupButton type="button" variant="ghost" size="icon-xs" aria-label={shown ? `Masquer ${label.toLowerCase()}` : `Afficher ${label.toLowerCase()}`} onClick={toggle}>{shown ? <IconEyeOff aria-hidden="true" /> : <IconEye aria-hidden="true" />}</InputGroupButton></InputGroupAddon></InputGroup><FieldError id={`reset-${name}-error`} errors={errors[name] ? [{ message: errors[name] }] : undefined} /></Field>}</form.Field>
  )

  return (
    <form className="flex flex-col gap-8" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit() }} noValidate aria-busy={mutation.isPending}>
      <AuthFormHeader title="Nouveau mot de passe" description="Choisissez un nouveau mot de passe pour votre compte." />
      <FieldGroup>
        {errors.form ? <div ref={errorRef} tabIndex={-1} role="alert"><FieldError errors={[{ message: errors.form }]} /></div> : null}
        {!resetToken ? <p role="alert" className="text-sm text-destructive">Le lien ne contient aucun jeton de réinitialisation.</p> : null}
        {passwordField("password", "Nouveau mot de passe", visible.password, () => setVisible((current) => ({ ...current, password: !current.password })))}
        {passwordField("confirmPassword", "Confirmer le mot de passe", visible.confirmation, () => setVisible((current) => ({ ...current, confirmation: !current.confirmation })))}
      </FieldGroup>
      <div className="flex flex-col gap-4"><Button type="submit" size="lg" className="w-full" disabled={mutation.isPending || !resetToken}>{mutation.isPending ? <Spinner /> : null}Réinitialiser</Button><p className="text-center text-sm text-muted-foreground"><Link href={routes.auth.signIn} className="text-foreground underline-offset-4 hover:underline">Retour à la connexion</Link></p></div>
    </form>
  )
}
