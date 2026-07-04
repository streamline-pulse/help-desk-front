import { z } from "zod"

export const emailSchema = z
  .string()
  .trim()
  .min(1, "L’adresse e-mail est requise.")
  .email("L’adresse e-mail n’est pas valide.")

export const passwordSchema = z
  .string()
  .min(1, "Le mot de passe est requis.")
  .min(6, "Le mot de passe doit contenir au moins 6 caractères.")

export const requiredTextSchema = (label: string) =>
  z.string().trim().min(1, `${label} est requis.`)
