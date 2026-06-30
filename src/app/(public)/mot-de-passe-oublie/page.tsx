import { AuthShell } from "@/app/(public)/_components/auth-shell"
import { ForgotPasswordForm } from "@/app/(public)/mot-de-passe-oublie/_components/forgot-password.form"

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  )
}
