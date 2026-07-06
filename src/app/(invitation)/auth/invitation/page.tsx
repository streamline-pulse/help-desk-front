import { AcceptInvitationForm } from "@/app/(invitation)/auth/invitation/_components/accept-invitation.form"
import { AuthShell } from "@/app/(public)/auth/_components/auth-shell"

export default async function AcceptInvitationPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams
  return <AuthShell><div className="space-y-6"><div><p className="text-sm font-medium text-muted-foreground">Accès au groupe</p><h1 className="mt-1 text-2xl font-semibold text-balance">Accepter l’invitation</h1></div><AcceptInvitationForm token={token} /></div></AuthShell>
}
