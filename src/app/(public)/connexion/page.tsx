import { Suspense } from "react"

import { AuthShell } from "@/app/(public)/_components/auth-shell"
import { SignInForm } from "@/app/(public)/connexion/_components/sign-in.form"
import { Spinner } from "@/components/ui/spinner"

function SignInFallback() {
  return (
    <div className="flex justify-center py-12">
      <Spinner className="size-6" />
    </div>
  )
}

export default function SignInPage() {
  return (
    <AuthShell>
      <Suspense fallback={<SignInFallback />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  )
}
