const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return "L'adresse e-mail est requise."
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "L'adresse e-mail n'est pas valide."
  }

  return undefined
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return "Le mot de passe est requis."
  }

  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères."
  }

  return undefined
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string
): string | undefined {
  if (!confirmation) {
    return "La confirmation du mot de passe est requise."
  }

  if (password !== confirmation) {
    return "Les mots de passe ne correspondent pas."
  }

  return undefined
}

export function validateOtp(otp: string): string | undefined {
  if (!otp) {
    return "Le code de vérification est requis."
  }

  if (!/^\d{6}$/.test(otp)) {
    return "Le code doit contenir exactement 6 chiffres."
  }

  return undefined
}
