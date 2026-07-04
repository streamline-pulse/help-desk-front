import { z } from "zod"

import { emailSchema } from "@/schemas/auth-fields.schema"

export const verifyEmailSchema = z.object({
  id: z.string().trim().min(1, "Le lien de vérification est incomplet."),
  verificationToken: z
    .string()
    .trim()
    .min(1, "Le jeton de vérification est requis."),
})

export const resendVerificationSchema = z.object({ email: emailSchema })

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>
