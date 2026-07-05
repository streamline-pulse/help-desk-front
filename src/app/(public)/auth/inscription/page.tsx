import { Suspense } from "react"

import { AuthShell } from "@/app/(public)/auth/_components/auth-shell"
import { SignUpForm } from "@/app/(public)/auth/inscription/_components/sign-up.form"
import { Spinner } from "@/components/ui/spinner"

export default function SignUpPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="flex justify-center py-12"><Spinner className="size-6" /></div>}>
        <SignUpForm />
      </Suspense>
    </AuthShell>
  )
}
