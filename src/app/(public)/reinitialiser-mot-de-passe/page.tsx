import { AuthShell } from "@/app/(public)/_components/auth-shell"
import { ResetPasswordForm } from "@/app/(public)/reinitialiser-mot-de-passe/_components/reset-password.form"

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <ResetPasswordForm />
    </AuthShell>
  )
}
