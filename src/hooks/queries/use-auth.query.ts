import { useQuery, useQueryClient } from "@tanstack/react-query"

import { authQueryKeys } from "@/hooks/queries/auth-query-keys"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { authBffService } from "@/services/auth-bff.service"
import type {
  EmailRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  VerifyEmailRequest,
} from "@/types/api/auth.type"

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authQueryKeys.currentUser(),
    queryFn: authBffService.getCurrentUser,
    retry: false,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  })
}

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useApiMutation(
    {
      mutationFn: (input: SignInRequest) => authBffService.signIn(input),
      onSuccess: ({ user }) => {
        if (user) {
          queryClient.setQueryData(authQueryKeys.currentUser(), user)
        } else {
          void queryClient.invalidateQueries({
            queryKey: authQueryKeys.currentUser(),
          })
        }
      },
    },
    {
      loading: "Connexion en cours…",
      success: "Connexion réussie.",
      error: "Impossible de vous connecter.",
    }
  )
}

export function useSignUpMutation() {
  return useApiMutation(
    {
      mutationFn: (input: SignUpRequest) => authBffService.signUp(input),
    },
    {
      loading: "Création du compte…",
      success: "Le compte a été créé.",
      error: "Impossible de créer le compte.",
    }
  )
}

export function useVerifyEmailMutation() {
  const queryClient = useQueryClient()

  return useApiMutation(
    {
      mutationFn: (input: VerifyEmailRequest) =>
        authBffService.verifyEmail(input),
      onSuccess: () =>
        queryClient.removeQueries({ queryKey: authQueryKeys.all }),
    },
    {
      loading: "Vérification en cours…",
      success: "Votre adresse e-mail a été vérifiée.",
      error: "Impossible de vérifier votre adresse e-mail.",
    }
  )
}

export function useResendVerificationMutation() {
  return useApiMutation(
    {
      mutationFn: (input: EmailRequest) =>
        authBffService.resendVerification(input),
    },
    {
      loading: "Envoi du code…",
      success: "Un nouveau code a été envoyé.",
      error: "Impossible d’envoyer un nouveau code.",
    }
  )
}

export function useForgotPasswordMutation() {
  return useApiMutation(
    {
      mutationFn: (input: EmailRequest) => authBffService.sendResetEmail(input),
    },
    {
      loading: "Envoi de l’e-mail…",
      success: "L’e-mail de réinitialisation a été envoyé.",
      error: "Impossible d’envoyer l’e-mail de réinitialisation.",
    }
  )
}

export function useResetPasswordMutation() {
  const queryClient = useQueryClient()

  return useApiMutation(
    {
      mutationFn: (input: ResetPasswordRequest) =>
        authBffService.resetPassword(input),
      onSuccess: () =>
        queryClient.removeQueries({ queryKey: authQueryKeys.all }),
    },
    {
      loading: "Réinitialisation du mot de passe…",
      success: "Votre mot de passe a été réinitialisé.",
      error: "Impossible de réinitialiser le mot de passe.",
    }
  )
}

export function useSignOutMutation() {
  const queryClient = useQueryClient()

  return useApiMutation(
    {
      mutationFn: authBffService.signOut,
      onSettled: () =>
        queryClient.removeQueries({ queryKey: authQueryKeys.all }),
    },
    {
      loading: "Déconnexion…",
      success: "Vous êtes déconnecté.",
      error: "Impossible de terminer la déconnexion.",
    }
  )
}
