import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().nonempty(),
  phone: z.string().refine((val) => val.length === 10, {
    message: 'Phone number must be exactly 10 characters long',
  }),
  address: z.string().nonempty(),
  notes: z.string().optional(),
})

export const updateClientSchema = createClientSchema.partial()

export const clientIdParamSchema = z.object({
  id: z.string().nonempty(),
})
