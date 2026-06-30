"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { AuthFormHeader } from "@/app/(public)/_components/auth-form-header"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { validateOtp } from "@/utils/auth-validation"

export function OtpVerificationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const flow = searchParams.get("flow")
  const isResetFlow = flow === "reset"

  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const otpError = validateOtp(otp)
    setError(otpError)

    if (otpError) {
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    if (isResetFlow) {
      router.push(routes.auth.resetPassword)
      return
    }

    toast.success("Compte vérifié. Vous pouvez maintenant vous connecter.")
    router.push(routes.auth.signIn)
  }

  function handleResendCode() {
    toast.info("Un nouveau code a été envoyé à votre adresse e-mail.")
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
      <AuthFormHeader
        title="Vérification du code"
        description={
          isResetFlow
            ? "Saisissez le code reçu pour réinitialiser votre mot de passe."
            : "Saisissez le code à 6 chiffres envoyé à votre adresse e-mail."
        }
      />

      <FieldGroup>
        <Field data-invalid={!!error}>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            aria-invalid={!!error}
          >
            <InputOTPGroup aria-invalid={!!error}>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldError errors={error ? [{ message: error }] : undefined} />
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : null}
          Vérifier
        </Button>

        <p className="text-center text-sm text-pretty text-muted-foreground">
          Vous n&apos;avez pas reçu le code ?{" "}
          <button
            type="button"
            className="text-foreground underline-offset-4 hover:underline"
            onClick={handleResendCode}
          >
            Renvoyer le code
          </button>
        </p>

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
