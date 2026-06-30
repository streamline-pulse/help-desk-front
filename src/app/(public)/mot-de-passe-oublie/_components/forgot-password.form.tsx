"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AuthFormHeader } from "@/app/(public)/_components/auth-form-header"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { validateEmail } from "@/utils/auth-validation"

type FormErrors = {
  email?: string
}

export function ForgotPasswordForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {
      email: validateEmail(email),
    }

    setErrors(nextErrors)

    if (nextErrors.email) {
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    router.push(`${routes.auth.verifyOtp}?flow=reset`)
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
      <AuthFormHeader
        title="Mot de passe oublié"
        description="Saisissez votre e-mail pour recevoir un code de vérification."
      />

      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="forgot-password-email">E-mail</FieldLabel>
          <Input
            id="forgot-password-email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={!!errors.email}
          />
          <FieldError errors={errors.email ? [{ message: errors.email }] : undefined} />
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : null}
          Envoyer le code
        </Button>

        <p className="text-center text-sm text-pretty text-muted-foreground">
          <Link
            href={routes.auth.signIn}
            className="text-foreground underline-offset-4 hover:underline"
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    </form>
  )
}
