"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { useAuth } from "@/hooks/use-auth"

export function HomeContent() {
  const router = useRouter()
  const { session, isAuthenticated, signOut } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(routes.auth.signIn)
    }
  }, [isAuthenticated, router])

  function handleSignOut() {
    signOut()
    router.push(routes.auth.signIn)
  }

  if (!isAuthenticated || !session) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
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
        <Button size="lg">Accéder au tableau de bord</Button>
        <Button variant="outline" size="lg" onClick={handleSignOut}>
          Se déconnecter
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        <Link
          href={routes.auth.signIn}
          className="underline-offset-4 hover:underline"
        >
          Page de connexion
        </Link>
      </p>
    </div>
  )
}
