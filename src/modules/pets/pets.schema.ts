import z from 'zod'
import { Sex, Species } from '../../generated/prisma/client'

export const createPetSchema = z.object({
  name: z.string().nonempty(),
  species: z.enum(Species),
  breed: z.string().optional(),
  sex: z.enum(Sex),
  birthDate: z.coerce.date().optional(),
  clientId: z.string().nonempty(),
  color: z.string().optional(),
  notes: z.string().optional(),
})

export const updatePetSchema = z.object({
  name: z.string().nonempty().optional(),
  species: z.enum(Species).optional(),
  breed: z.string().optional(),
  sex: z.enum(Sex).optional(),
  birthDate: z.coerce.date().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
})

export type CreatePetDto = z.infer<typeof createPetSchema>
export type UpdatePetDto = z.infer<typeof updatePetSchema>

export const petIdParamSchema = z.object({
  petId: z.string().nonempty(),
})
