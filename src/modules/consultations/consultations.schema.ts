import { z } from 'zod'

// Schema para crear consulta (dentro de una visita)
export const createConsultationSchema = z.object({
  visitId: z.string(),
  recordId: z.string(),
  reason: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
})

// Schema para actualizar consulta
export const updateConsultationSchema = z.object({
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
  visitId: z.string().optional(),
  recordId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

// Tipos TypeScript exportados
export type CreateConsultationDto = z.infer<typeof createConsultationSchema>
export type UpdateConsultationDto = z.infer<typeof updateConsultationSchema>
export type ConsultationIdParam = z.infer<typeof consultationIdParamSchema>
export type RecordIdParam = z.infer<typeof recordIdParamSchema>
export type ConsultationsQueryDto = z.infer<typeof consultationsQuerySchema>
