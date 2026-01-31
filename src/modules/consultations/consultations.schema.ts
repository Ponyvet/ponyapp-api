import { z } from 'zod'

// Schema para crear consulta
export const createConsultationSchema = z.object({
  recordId: z.string(),
  date: z.coerce.date().optional(),
  reason: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  veterinarianId: z.string(),
})

// Schema para actualizar consulta
export const updateConsultationSchema = z.object({
  date: z.coerce.date().optional(),
  reason: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
})

// Schema para parámetros de ID
export const consultationIdParamSchema = z.object({
  id: z.string(),
})

// Schema para parámetros de cartilla médica
export const recordIdParamSchema = z.object({
  recordId: z.string(),
})

// Schema para query de filtros
export const consultationsQuerySchema = z.object({
  recordId: z.string().optional(),
  veterinarianId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

// Schema para rango de fechas
export const dateRangeQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

// Tipos TypeScript exportados
export type CreateConsultationDto = z.infer<typeof createConsultationSchema>
export type UpdateConsultationDto = z.infer<typeof updateConsultationSchema>
export type ConsultationIdParam = z.infer<typeof consultationIdParamSchema>
export type RecordIdParam = z.infer<typeof recordIdParamSchema>
export type ConsultationsQueryDto = z.infer<typeof consultationsQuerySchema>
export type DateRangeQueryDto = z.infer<typeof dateRangeQuerySchema>
