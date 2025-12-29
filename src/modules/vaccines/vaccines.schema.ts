import z from 'zod'
import { Species } from '../../generated/prisma/enums'

export const createVaccineSchema = z.object({
  name: z.string().nonempty(),
  species: z.enum(Species),
  type: z.string().nonempty(),
  intervalDays: z.number().int().positive(),
})
