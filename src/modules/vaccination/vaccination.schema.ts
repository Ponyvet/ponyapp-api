import z from 'zod'

export const createVaccinationSchema = z.object({
  appliedAt: z.coerce.date(),
  nextDueDate: z.coerce.date().optional(),
  medicationId: z.string(),
  recordId: z.string(),
  consultationId: z.string().optional(),
  veterinarianId: z.string(),
})

export const updateVaccinationSchema = z.object({
  appliedAt: z.coerce.date().optional(),
  nextDueDate: z.coerce.date().optional(),
  medicationId: z.string().optional(),
  consultationId: z.string().optional(),
})

export const recordIdParamSchema = z.object({
  recordId: z.string(),
})

export const vaccinationIdParamSchema = z.object({
  id: z.string(),
})

export const dateRangeQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

export const vaccinationsQuerySchema = z.object({
  recordId: z.string().optional(),
  medicationId: z.string().optional(),
  veterinarianId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

export type CreateVaccinationDto = z.infer<typeof createVaccinationSchema>
export type UpdateVaccinationDto = z.infer<typeof updateVaccinationSchema>
export type DateRangeQueryDto = z.infer<typeof dateRangeQuerySchema>
export type VaccinationsQueryDto = z.infer<typeof vaccinationsQuerySchema>
