export const routes = {
  home: "/",
  auth: {
    signIn: "/connexion",
    signUp: "/inscription",
    forgotPassword: "/mot-de-passe-oublie",
    verifyOtp: "/verification-otp",
    resetPassword: "/reinitialiser-mot-de-passe",
  },
} as const
