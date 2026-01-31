import z from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export type LoginInput = z.infer<typeof loginSchema>

export const sessionSchema = z.object({
  id: z.string(),
  role: z.string(),
  clientId: z.string().optional(),
  iat: z.number(),
})

export type SessionData = z.infer<typeof sessionSchema>
