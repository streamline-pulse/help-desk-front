import { AuthShell } from "@/app/(public)/_components/auth-shell"
import { SignInForm } from "@/app/(public)/connexion/_components/sign-in.form"

export default function SignInPage() {
  return (
    <AuthShell>
      <SignInForm />
    </AuthShell>
  )
}
