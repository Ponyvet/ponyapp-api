import z from 'zod'
import { VaccinationStatus } from '../../generated/prisma/enums'

export const createVaccinationItemSchema = z
  .object({
    appliedAt: z.coerce.date().nullable(),
    nextDueDate: z.coerce.date().nullable(),
    status: z.enum(VaccinationStatus),
    petId: z.string().nonempty(),
    vaccineId: z.string().nonempty(),
    veterinarianId: z.string().nonempty(),
  })
  .superRefine((data, ctx) => {
    if (!data.appliedAt && !data.nextDueDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one of appliedAt or nextDueDate must be provided',
      })
    }

    if (
      data.appliedAt &&
      data.nextDueDate &&
      data.nextDueDate <= data.appliedAt
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'nextDueDate must be after appliedAt',
        path: ['nextDueDate'],
      })
    }
  })

export const updateVaccinationSchema = z.object({
  appliedAt: z.coerce.date().nullable().optional(),
  nextDueDate: z.coerce.date().nullable().optional(),
  status: z.enum(VaccinationStatus).optional(),
})

export const petIdParamSchema = z.object({
  petId: z.string().nonempty(),
})

export const vaccinationIdParamSchema = z.object({
  id: z.string().nonempty(),
})

export const dateRangeQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

export type CreateVaccinationDto = z.infer<typeof createVaccinationItemSchema>
export type UpdateVaccinationDto = z.infer<typeof updateVaccinationSchema>
export type DateRangeQueryDto = z.infer<typeof dateRangeQuerySchema>
