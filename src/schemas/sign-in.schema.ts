import { z } from "zod"

import { emailSchema, passwordSchema } from "@/schemas/auth-fields.schema"

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean(),
})

export type SignInFormValues = z.infer<typeof signInSchema>
