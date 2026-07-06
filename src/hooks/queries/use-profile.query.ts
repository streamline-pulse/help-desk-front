import { useQueryClient } from "@tanstack/react-query"

import { authQueryKeys } from "@/hooks/queries/auth-query-keys"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type {
  ProfileInformationInput,
  ProfileSecurityInput,
} from "@/schemas/profile.schema"
import { userService } from "@/services/user.service"

export function useUpdateMyProfileMutation() {
  const client = useQueryClient()

  return useApiMutation(
    {
      mutationFn: ({
        id,
        input,
      }: {
        id: string
        input: Partial<ProfileInformationInput & ProfileSecurityInput>
      }) => userService.updateMe(id, input),
      onSuccess: () =>
        Promise.all([
          client.invalidateQueries({ queryKey: authQueryKeys.currentUser() }),
          client.invalidateQueries({ queryKey: ["users"] }),
        ]),
    },
    {
      loading: "Mise à jour du profil…",
      success: "Le profil a été mis à jour.",
      error: "Impossible de mettre à jour le profil.",
    }
  )
}
