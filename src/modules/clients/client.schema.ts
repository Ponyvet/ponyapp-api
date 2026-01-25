import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().nonempty(),
  phone: z.string().min(8),
  address: z.string().nonempty(),
  notes: z.string().optional(),
})

export const updateClientSchema = z.object({
  name: z.string().nonempty().optional(),
  phone: z.string().min(8).optional(),
  address: z.string().nonempty().optional(),
  notes: z.string().optional(),
})

export const clientIdParamSchema = z.object({
  id: z.string().nonempty(),
})
