import { AuthShell } from "@/app/(public)/_components/auth-shell"
import { SignUpForm } from "@/app/(public)/inscription/_components/sign-up.form"

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUpForm />
    </AuthShell>
  )
}
