import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().nonempty(),
  phone: z.string().refine((val) => val.length === 10, {
    message: 'Phone number must be exactly 10 characters long',
  }),
  address: z.string().nonempty(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  notes: z.string().optional(),
})

export const updateClientSchema = createClientSchema.partial()

export const clientIdParamSchema = z.object({
  id: z.string().nonempty(),
})
