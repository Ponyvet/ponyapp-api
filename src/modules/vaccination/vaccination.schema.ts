import z from 'zod'
import { VaccinationStatus } from '../../generated/prisma/enums'

export const createVaccinationItemSchema = z.object({
  appliedAt: z.coerce.date(),
  nextDueDate: z.coerce.date(),
  status: z.enum(VaccinationStatus),
  petId: z.string().nonempty(),
  vaccineId: z.string().nonempty(),
  veterinarianId: z.string().nonempty(),
})

export const petIdParamSchema = z.object({
  petId: z.string().nonempty(),
})

export const dateRangeQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

export type CreateVaccinationDto = z.infer<typeof createVaccinationItemSchema>
export type DateRangeQueryDto = z.infer<typeof dateRangeQuerySchema>
