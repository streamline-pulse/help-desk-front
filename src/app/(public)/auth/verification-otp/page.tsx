import { Suspense } from "react"

import { AuthShell } from "@/app/(public)/auth/_components/auth-shell"
import { OtpVerificationForm } from "@/app/(public)/auth/verification-otp/_components/otp-verification.form"
import { Spinner } from "@/components/ui/spinner"

function OtpVerificationFallback() {
  return (
    <div className="flex justify-center py-12">
      <Spinner className="size-6" />
    </div>
  )
}

export default function OtpVerificationPage() {
  return (
    <AuthShell>
      <Suspense fallback={<OtpVerificationFallback />}>
        <OtpVerificationForm />
      </Suspense>
    </AuthShell>
  )
}
