"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { AuthFormHeader } from "@/app/(public)/auth/_components/auth-form-header"
import { Button } from "@/components/ui/button"
import { FieldError, FieldGroup } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/hooks/queries/use-auth.query"
import { resendVerificationSchema, verifyEmailSchema } from "@/schemas/verify-email.schema"

const RESEND_DELAY_SECONDS = 60

export function OtpVerificationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verifyMutation = useVerifyEmailMutation()
  const resendMutation = useResendVerificationMutation()
  const errorRef = useRef<HTMLDivElement>(null)
  const id = searchParams.get("id")?.trim() ?? ""
  const verificationToken = searchParams.get("verificationToken")?.trim() ?? ""
  const email = searchParams.get("email")?.trim() ?? ""
  const [error, setError] = useState<string>()
  const [status, setStatus] = useState<string>()
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    if (remainingSeconds <= 0) return

    const timer = window.setInterval(
      () => setRemainingSeconds((current) => Math.max(0, current - 1)),
      1_000
    )

    return () => window.clearInterval(timer)
  }, [remainingSeconds])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = verifyEmailSchema.safeParse({ id, verificationToken })

    if (!parsed.success) {
      setError("Le lien de vérification est incomplet ou invalide. Demandez un nouveau message.")
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }

    try {
      await verifyMutation.mutateAsync(parsed.data)
      router.replace(`${routes.auth.signIn}?verified=success`)
      router.refresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Impossible de valider l’adresse e-mail.")
      requestAnimationFrame(() => errorRef.current?.focus())
    }
  }

  async function handleResend() {
    const parsed = resendVerificationSchema.safeParse({ email })
    if (!parsed.success) {
      setError("L’adresse e-mail manque dans ce lien. Recommencez depuis l’inscription.")
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }

    try {
      await resendMutation.mutateAsync(parsed.data)
      setError(undefined)
      setStatus("Si cette adresse est valide, un nouveau message de vérification a été envoyé.")
      setRemainingSeconds(RESEND_DELAY_SECONDS)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Impossible de renvoyer le message.")
      requestAnimationFrame(() => errorRef.current?.focus())
    }
  }

  const hasVerificationLink = Boolean(id && verificationToken)

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate aria-busy={verifyMutation.isPending || resendMutation.isPending}>
      <AuthFormHeader
        title="Vérification de l’adresse e-mail"
        description={hasVerificationLink ? "Confirmez la validation de votre adresse e-mail." : "Consultez le lien reçu par e-mail pour activer votre compte."}
      />
      <FieldGroup>
        {error ? <div ref={errorRef} tabIndex={-1} role="alert"><FieldError errors={[{ message: error }]} /></div> : null}
        {status ? <p role="status" className="text-sm text-muted-foreground">{status}</p> : null}
      </FieldGroup>
      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" className="w-full" disabled={!hasVerificationLink || verifyMutation.isPending}>
          {verifyMutation.isPending ? <Spinner /> : null}
          Valider mon adresse e-mail
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Vous n’avez pas reçu le message ?{" "}
          <button type="button" className="text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50" onClick={() => void handleResend()} disabled={remainingSeconds > 0 || resendMutation.isPending}>
            {remainingSeconds > 0 ? `Renvoyer dans ${remainingSeconds} s` : "Renvoyer le message"}
          </button>
        </p>
        <p className="text-center text-sm text-muted-foreground"><Link href={routes.auth.signIn} className="text-foreground underline-offset-4 hover:underline">Retour à la connexion</Link></p>
      </div>
    </form>
  )
}
