"use client"

import Link from "next/link"
import { IconCheck, IconTicketOff } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { useAcceptGroupInvitationMutation } from "@/hooks/queries/use-group-invitation.query"

export function AcceptInvitationForm({ token }: { token: string }) {
  const mutation = useAcceptGroupInvitationMutation()
  if (!token) return <Alert variant="destructive"><IconTicketOff /><AlertTitle>Lien incomplet</AlertTitle><AlertDescription>Le jeton d’invitation est absent. Demandez un nouveau lien à l’administrateur du groupe.</AlertDescription></Alert>
  if (mutation.isSuccess) return <div className="space-y-4"><Alert><IconCheck /><AlertTitle>Invitation acceptée</AlertTitle><AlertDescription>Le groupe est maintenant associé à votre compte.</AlertDescription></Alert><Button render={<Link href={routes.board.groups.root} />} className="w-full">Accéder aux groupes</Button></div>
  return <div className="space-y-4"><p className="text-sm text-pretty text-muted-foreground">Confirmez pour rejoindre le groupe avec le rôle prévu par cette invitation. Vous devez être connecté au compte destinataire.</p>{mutation.isError ? <Alert variant="destructive"><AlertTitle>Acceptation impossible</AlertTitle><AlertDescription>{mutation.error.message}</AlertDescription></Alert> : null}<Button className="w-full" disabled={mutation.isPending} onClick={() => mutation.mutate({ invitationToken: token })}>{mutation.isPending ? <Spinner /> : null}Accepter l’invitation</Button><Button render={<Link href={routes.auth.signIn} />} variant="ghost" className="w-full">Se connecter avec un autre compte</Button></div>
}
