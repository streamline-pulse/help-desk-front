"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { AuthFormHeader } from "@/app/(public)/auth/_components/auth-form-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { useSignUpMutation } from "@/hooks/queries/use-auth.query"
import { signUpSchema, type SignUpFormValues } from "@/schemas/sign-up.schema"
import { focusFirstInvalidField, getZodFormErrors, type FormErrors } from "@/utils/form-validation"

export function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mutation = useSignUpMutation()
  const errorRef = useRef<HTMLDivElement>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [visible, setVisible] = useState({ password: false, confirmation: false })

  const form = useForm({
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", acceptedTerms: false, rememberMe: false } as SignUpFormValues,
    onSubmit: async ({ value }) => {
      const result = signUpSchema.safeParse(value)
      if (!result.success) {
        const nextErrors = getZodFormErrors(result.error)
        setErrors(nextErrors)
        focusFirstInvalidField(nextErrors)
        return
      }

      const invitationToken = searchParams.get("invitationToken")?.trim() || undefined

      try {
        const response = await mutation.mutateAsync({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          email: result.data.email,
          password: result.data.password,
          rememberMe: result.data.rememberMe,
          invitationToken,
        })
        const userId = response.user?.id
        if (!userId) {
          setErrors({ form: "Le compte a été créé, mais la réponse ne contient pas l’identifiant nécessaire à sa validation." })
          requestAnimationFrame(() => errorRef.current?.focus())
          return
        }
        const params = new URLSearchParams({ id: userId, email: result.data.email })
        router.replace(`${routes.auth.verifyOtp}?${params.toString()}`)
      } catch (error) {
        setErrors({ form: error instanceof Error ? error.message : "Impossible de créer le compte." })
        requestAnimationFrame(() => errorRef.current?.focus())
      }
    },
  })

  function clearError(name: string) {
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }))
  }

  const textField = (name: "firstName" | "lastName" | "email", label: string, type = "text", autoComplete?: string) => (
    <form.Field name={name}>
      {(field) => (
        <Field data-invalid={!!errors[name]}>
          <FieldLabel htmlFor={`sign-up-${name}`}>{label}</FieldLabel>
          <Input id={`sign-up-${name}`} name={field.name} type={type} autoComplete={autoComplete} required value={field.state.value} onBlur={field.handleBlur} onChange={(event) => { field.handleChange(event.target.value); clearError(name) }} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `sign-up-${name}-error` : undefined} />
          <FieldError id={`sign-up-${name}-error`} errors={errors[name] ? [{ message: errors[name] }] : undefined} />
        </Field>
      )}
    </form.Field>
  )

  const passwordField = (name: "password" | "confirmPassword", label: string, shown: boolean, toggle: () => void) => (
    <form.Field name={name}>
      {(field) => (
        <Field data-invalid={!!errors[name]}>
          <FieldLabel htmlFor={`sign-up-${name}`}>{label}</FieldLabel>
          <InputGroup>
            <InputGroupInput id={`sign-up-${name}`} name={field.name} type={shown ? "text" : "password"} autoComplete="new-password" required value={field.state.value} onBlur={field.handleBlur} onChange={(event) => { field.handleChange(event.target.value); clearError(name) }} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `sign-up-${name}-error` : undefined} />
            <InputGroupAddon align="inline-end"><InputGroupButton type="button" variant="ghost" size="icon-xs" aria-label={shown ? `Masquer ${label.toLowerCase()}` : `Afficher ${label.toLowerCase()}`} onClick={toggle}>{shown ? <IconEyeOff aria-hidden="true" /> : <IconEye aria-hidden="true" />}</InputGroupButton></InputGroupAddon>
          </InputGroup>
          <FieldError id={`sign-up-${name}-error`} errors={errors[name] ? [{ message: errors[name] }] : undefined} />
        </Field>
      )}
    </form.Field>
  )

  return (
    <form className="flex flex-col gap-8" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit() }} noValidate aria-busy={mutation.isPending}>
      <AuthFormHeader title="Créer votre compte" description="Rejoignez la plateforme Help Desk." />
      <FieldGroup>
        {errors.form ? <div ref={errorRef} tabIndex={-1} role="alert"><FieldError errors={[{ message: errors.form }]} /></div> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          {textField("firstName", "Prénom", "text", "given-name")}
          {textField("lastName", "Nom", "text", "family-name")}
        </div>
        {textField("email", "E-mail", "email", "email")}
        {passwordField("password", "Mot de passe", visible.password, () => setVisible((current) => ({ ...current, password: !current.password })))}
        {passwordField("confirmPassword", "Confirmer le mot de passe", visible.confirmation, () => setVisible((current) => ({ ...current, confirmation: !current.confirmation })))}
        <form.Field name="acceptedTerms">{(field) => <Field data-invalid={!!errors.acceptedTerms}><div className="flex items-start gap-2.5"><Checkbox id="sign-up-terms" name={field.name} checked={field.state.value} onCheckedChange={(checked) => { field.handleChange(checked === true); clearError("acceptedTerms") }} aria-invalid={!!errors.acceptedTerms} aria-describedby={errors.acceptedTerms ? "sign-up-terms-error" : undefined} /><label htmlFor="sign-up-terms" className="text-sm leading-snug">J’accepte les Conditions d’utilisation et la Politique de confidentialité.</label></div><FieldError id="sign-up-terms-error" errors={errors.acceptedTerms ? [{ message: errors.acceptedTerms }] : undefined} /></Field>}</form.Field>
        <form.Field name="rememberMe">{(field) => <div className="flex items-center gap-2.5"><Checkbox id="sign-up-remember" checked={field.state.value} onCheckedChange={(checked) => field.handleChange(checked === true)} /><label htmlFor="sign-up-remember" className="text-sm">Rester connecté pendant la validation</label></div>}</form.Field>
      </FieldGroup>
      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>{mutation.isPending ? <Spinner /> : null}Créer mon compte</Button>
        <p className="text-center text-sm text-muted-foreground">Déjà un compte ? <Link href={routes.auth.signIn} className="text-foreground underline-offset-4 hover:underline">Se connecter</Link></p>
      </div>
    </form>
  )
}
