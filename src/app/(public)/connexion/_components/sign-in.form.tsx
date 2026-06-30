"use client"

import { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { useAuth } from "@/hooks/use-auth"
import { signInWithMockCredentials } from "@/lib/auth-session"
import {
  validateEmail,
  validatePasswordRequired,
} from "@/utils/auth-validation"

type FormErrors = {
  email?: string
  password?: string
  form?: string
}

export function SignInForm() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(routes.home)
    }
  }, [isAuthenticated, router])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {
      email: validateEmail(email),
      password: validatePasswordRequired(password),
    }

    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.password) {
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    const result = signInWithMockCredentials(email, password)

    if (!result.ok) {
      setErrors({ form: result.message })
      setIsSubmitting(false)
      return
    }

    toast.success("Connexion réussie.")
    router.push(routes.home)
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
      <AuthFormHeader
        title="Connexion"
        description="Accédez à votre espace Help Desk CCMT."
      />

      <FieldGroup>
        {errors.form ? (
          <FieldError errors={[{ message: errors.form }]} />
        ) : null}

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="sign-in-email">E-mail</FieldLabel>
          <Input
            id="sign-in-email"
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
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="sign-in-password">Mot de passe</FieldLabel>
            <Link
              href={routes.auth.forgotPassword}
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <InputGroup>
            <InputGroupInput
              id="sign-in-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : null}
          Se connecter
        </Button>

        <p className="text-center text-sm text-pretty text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link
            href={routes.auth.signUp}
            className="text-foreground underline-offset-4 hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </form>
  )
}
