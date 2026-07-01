import Link from "next/link"

import { Button } from "@/components/ui/button"
import { routes } from "@/config/routes"

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="font-heading text-2xl font-semibold text-balance">
        Help Desk CCMT
      </h1>
      <p className="max-w-md text-pretty text-muted-foreground">
        Plateforme de gestion des demandes de support.
      </p>
      <Button
        nativeButton={false}
        render={<Link href={routes.auth.signIn} />}
        size="lg"
      >
        Se connecter
      </Button>
    </div>
  )
}
