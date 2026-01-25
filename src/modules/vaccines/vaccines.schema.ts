import z from 'zod'
import { Species } from '../../generated/prisma/enums'

export const createVaccineSchema = z.object({
  name: z.string().nonempty(),
  species: z.enum(Species),
  type: z.string().nonempty(),
  intervalDays: z.number().int().positive(),
})

export const updateVaccineSchema = z.object({
  name: z.string().nonempty().optional(),
  species: z.enum(Species).optional(),
  type: z.string().nonempty().optional(),
  intervalDays: z.number().int().positive().optional(),
})

export const vaccineIdParamSchema = z.object({
  id: z.string().nonempty(),
})
