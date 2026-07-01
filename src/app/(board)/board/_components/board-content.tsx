"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { routes } from "@/config/routes"
import { useAuth } from "@/hooks/use-auth"

export function BoardContent() {
  const router = useRouter()
  const { session, signOut } = useAuth()

  function handleSignOut() {
    signOut()
    router.push(routes.auth.signIn)
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="font-heading text-2xl font-semibold text-balance">
        Help Desk CCMT
      </h1>
      <p className="max-w-md text-pretty text-muted-foreground">
        Bienvenue sur la plateforme. Vous êtes connecté en tant que{" "}
        <span className="font-medium text-foreground">{session.email}</span>.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          nativeButton={false}
          size="lg"
          render={<Link href={routes.dashboard} />}
        >
          Accéder au tableau de bord
        </Button>
        <Button variant="outline" size="lg" onClick={handleSignOut}>
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}
