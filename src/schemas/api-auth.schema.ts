import { z } from "zod"

import {
  emailSchema,
  passwordSchema,
  requiredTextSchema,
} from "@/schemas/auth-fields.schema"
import { signInSchema } from "@/schemas/sign-in.schema"
import { verifyEmailSchema } from "@/schemas/verify-email.schema"

export const signInRequestSchema = signInSchema

export const signUpRequestSchema = z.object({
  firstName: requiredTextSchema("Le prénom"),
  lastName: requiredTextSchema("Le nom"),
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean(),
  invitationToken: z.string().trim().optional(),
})

export const verifyEmailRequestSchema = verifyEmailSchema.extend({
  logOutDevices: z.boolean().optional(),
  rememberMe: z.boolean().optional(),
})

export const emailRequestSchema = z.object({ email: emailSchema })

export const resetPasswordRequestSchema = z.object({
  password: passwordSchema,
  resetToken: z.string().trim().min(1),
  logOutDevices: z.boolean().optional(),
  rememberMe: z.boolean().optional(),
})

export const passwordOnlySchema = z.object({ password: passwordSchema })
