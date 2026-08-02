import { z } from 'zod'
import { UserRole } from '../../generated/prisma/client.js'

export const createUserSchema = z.object({
  name: z.string().nonempty(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(UserRole),
  clientId: z.string().nullish(),
})

export const updateUserSchema = z.object({
  name: z.string().nonempty().optional(),
  email: z.email().optional(),
  role: z.enum(UserRole).optional(),
  clientId: z.string().nullish(),
  isActive: z.boolean().optional(),
})

export const userIdParamSchema = z.object({
  id: z.string(),
})

export type CreateUserDto = z.infer<typeof createUserSchema>
export type UpdateUserDto = z.infer<typeof updateUserSchema>
