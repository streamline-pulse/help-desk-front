import { Suspense } from "react"

import { AuthShell } from "@/app/(public)/_components/auth-shell"
import { ResetPasswordForm } from "@/app/(public)/reinitialiser-mot-de-passe/_components/reset-password.form"
import { Spinner } from "@/components/ui/spinner"

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="flex justify-center py-12"><Spinner className="size-6" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
