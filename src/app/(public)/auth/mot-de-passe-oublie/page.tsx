import { AuthShell } from "@/app/(public)/auth/_components/auth-shell"
import { ForgotPasswordForm } from "@/app/(public)/auth/mot-de-passe-oublie/_components/forgot-password.form"

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  )
}
