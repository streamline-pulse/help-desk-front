import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { authQueryKeys } from "@/hooks/queries/auth-query-keys"
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

  return useMutation({
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
  })
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (input: SignUpRequest) => authBffService.signUp(input),
  })
}

export function useVerifyEmailMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: VerifyEmailRequest) =>
      authBffService.verifyEmail(input),
    onSuccess: () => queryClient.removeQueries({ queryKey: authQueryKeys.all }),
  })
}

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: (input: EmailRequest) =>
      authBffService.resendVerification(input),
  })
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (input: EmailRequest) => authBffService.sendResetEmail(input),
  })
}

export function useResetPasswordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ResetPasswordRequest) =>
      authBffService.resetPassword(input),
    onSuccess: () => queryClient.removeQueries({ queryKey: authQueryKeys.all }),
  })
}

export function useSignOutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authBffService.signOut,
    onSettled: () => queryClient.removeQueries({ queryKey: authQueryKeys.all }),
  })
}
