import { z } from "zod"

const nullablePhone = z.string().trim().max(30).optional().or(z.literal(""))

export const createUserSchema = z.object({
  email: z.email("L’adresse e-mail est invalide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  lastName: z.string().trim().min(1, "Le nom est requis.").max(120),
  firstName: z.string().trim().min(1, "Le prénom est requis.").max(120),
  roleId: z.string().min(1, "Le rôle est requis."),
  phone: nullablePhone,
  indicatif: nullablePhone,
  active: z.boolean(),
  isSuperAdmin: z.boolean(),
})

export const updateUserSchema = createUserSchema.omit({ password: true })

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
