import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().nonempty(),
  phone: z.string().min(8),
  address: z.string().nonempty(),
  notes: z.string().optional(),
})
