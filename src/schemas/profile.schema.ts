import { z } from "zod"

const nullablePhone = z.string().trim().max(30).optional().or(z.literal(""))

export const profileInformationSchema = z.object({
  email: z.email("L’adresse e-mail est invalide."),
  lastName: z.string().trim().min(1, "Le nom est requis.").max(120),
  firstName: z.string().trim().min(1, "Le prénom est requis.").max(120),
  phone: nullablePhone,
  indicatif: nullablePhone,
})

export const profileSecuritySchema = z.object({
  currentPassword: z.string().min(
    6,
    "Le mot de passe actuel doit contenir au moins 6 caractères."
  ),
  newPassword: z.string().min(
    6,
    "Le nouveau mot de passe doit contenir au moins 6 caractères."
  ),
})

export type ProfileInformationInput = z.infer<typeof profileInformationSchema>
export type ProfileSecurityInput = z.infer<typeof profileSecuritySchema>
