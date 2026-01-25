import { z } from 'zod'
import { UserRole } from '../../generated/prisma/client'

export const createUserSchema = z.object({
  name: z.string().nonempty(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(UserRole),
})

export const userIdParamSchema = z.object({
  id: z.string().nonempty(),
})

export type CreateUserDto = z.infer<typeof createUserSchema>
