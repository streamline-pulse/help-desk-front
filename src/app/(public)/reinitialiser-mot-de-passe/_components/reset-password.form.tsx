"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { toast } from "sonner"

import { AuthFormHeader } from "@/app/(public)/_components/auth-form-header"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import {
  validatePassword,
  validatePasswordConfirmation,
} from "@/utils/auth-validation"

type FormErrors = {
  password?: string
  confirmPassword?: string
}

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {
      password: validatePassword(password),
      confirmPassword: validatePasswordConfirmation(password, confirmPassword),
    }

    setErrors(nextErrors)

    if (nextErrors.password || nextErrors.confirmPassword) {
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    toast.success("Mot de passe réinitialisé. Vous pouvez vous connecter.")
    router.push(routes.auth.signIn)
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
      <AuthFormHeader
        title="Nouveau mot de passe"
        description="Choisissez un nouveau mot de passe pour votre compte."
      />

      <FieldGroup>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="reset-password">Nouveau mot de passe</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={!!errors.password}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={errors.password ? [{ message: errors.password }] : undefined} />
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="reset-confirm-password">
            Confirmer le mot de passe
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="reset-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={!!errors.confirmPassword}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={
                  showConfirmPassword
                    ? "Masquer la confirmation"
                    : "Afficher la confirmation"
                }
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError
            errors={
              errors.confirmPassword
                ? [{ message: errors.confirmPassword }]
                : undefined
            }
          />
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : null}
          Réinitialiser
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
