import { z } from "zod"

import {
  emailSchema,
  passwordSchema,
  requiredTextSchema,
} from "@/schemas/auth-fields.schema"

export const signUpSchema = z
  .object({
    firstName: requiredTextSchema("Le prénom"),
    lastName: requiredTextSchema("Le nom"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptedTerms: z.boolean().refine((accepted) => accepted, {
      message: "Vous devez accepter les conditions d’utilisation.",
    }),
    rememberMe: z.boolean(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>
