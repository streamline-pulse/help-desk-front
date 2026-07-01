"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { AuthFormHeader } from "@/app/(public)/_components/auth-form-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from "@/utils/auth-validation"

type FormErrors = {
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validatePasswordConfirmation(password, confirmPassword),
      terms: acceptedTerms
        ? undefined
        : "Vous devez accepter les conditions d'utilisation.",
    }

    setErrors(nextErrors)

    if (
      nextErrors.email ||
      nextErrors.password ||
      nextErrors.confirmPassword ||
      nextErrors.terms
    ) {
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    router.push(`${routes.auth.verifyOtp}?flow=signup`)
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
      <AuthFormHeader
        title="Créer votre compte"
        description="Rejoignez la plateforme Help Desk ."
      />

      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="sign-up-email">E-mail</FieldLabel>
          <Input
            id="sign-up-email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={!!errors.email}
          />
          <FieldError errors={errors.email ? [{ message: errors.email }] : undefined} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="sign-up-password">Mot de passe</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="sign-up-password"
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
          <FieldLabel htmlFor="sign-up-confirm-password">
            Confirmer le mot de passe
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="sign-up-confirm-password"
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

        <Field data-invalid={!!errors.terms}>
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="sign-up-terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              aria-invalid={!!errors.terms}
            />
            <label
              htmlFor="sign-up-terms"
              className="text-sm font-normal leading-snug [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary"
            >
              J&apos;accepte les{" "}
              <Link href="#">Conditions d&apos;utilisation</Link> et la{" "}
              <Link href="#">Politique de confidentialité</Link>
            </label>
          </div>
          <FieldError errors={errors.terms ? [{ message: errors.terms }] : undefined} />
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : null}
          Créer mon compte
        </Button>

        <p className="text-center text-sm text-pretty text-muted-foreground">
          Déjà un compte ?{" "}
          <Link
            href={routes.auth.signIn}
            className="text-foreground underline-offset-4 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </form>
  )
}
