import { z } from "zod"

import { emailSchema } from "@/schemas/auth-fields.schema"

export const forgotPasswordSchema = z.object({ email: emailSchema })

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
