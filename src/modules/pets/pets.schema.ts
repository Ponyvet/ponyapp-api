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

export type CreatePetDto = z.infer<typeof createPetSchema>
