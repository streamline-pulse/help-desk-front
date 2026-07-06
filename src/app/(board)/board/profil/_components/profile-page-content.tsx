"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page/page.header"
import { ProfileInformationForm } from "@/app/(board)/board/profil/_components/profile-information.form"
import { ProfileSecurityForm } from "@/app/(board)/board/profil/_components/profile-security.form"
import { useCurrentUserQuery } from "@/hooks/queries/use-auth.query"
import { useUpdateMyProfileMutation } from "@/hooks/queries/use-profile.query"
import { IconRosetteDiscountCheck } from "@tabler/icons-react"

export function ProfilePageContent() {
  const currentUserQuery = useCurrentUserQuery()
  const updateMyProfileMutation = useUpdateMyProfileMutation()

  if (currentUserQuery.isPending) {
    return (
      <div className="pb-10">
        <header className="grid gap-3 px-6 pt-10 pb-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-48 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </header>
        <div className="grid gap-6 px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    )
  }

  if (currentUserQuery.isError || !currentUserQuery.data) {
    return (
      <div className="px-6 py-10">
        <Alert variant="destructive">
          <AlertTitle>Profil indisponible</AlertTitle>
          <AlertDescription>
            Impossible de charger votre profil. Réessayez dans quelques instants.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="pb-10">
      <PageHeader
        label="Compte"
        title="Profil"
        description="Mettez à jour vos informations personnelles et vos paramètres de sécurité."
        icon={IconRosetteDiscountCheck}
      />
      <div className="grid gap-6 px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ProfileInformationForm
          user={currentUserQuery.data}
          mutation={updateMyProfileMutation}
        />
        <ProfileSecurityForm
          user={currentUserQuery.data}
          mutation={updateMyProfileMutation}
        />
      </div>
    </div>
  )
}
