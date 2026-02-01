import { z } from 'zod'

// Schema para crear visita
export const createVisitSchema = z.object({
  clientId: z.string(),
  date: z.coerce.date().optional(),
  generalNotes: z.string().optional(),
  veterinarianId: z.string(),
})

// Schema para actualizar visita
export const updateVisitSchema = z.object({
  date: z.coerce.date().optional(),
  generalNotes: z.string().optional(),
})

// Schema para parámetros de ID
export const visitIdParamSchema = z.object({
  id: z.string(),
})

// Schema para parámetros de cliente
export const clientIdParamSchema = z.object({
  clientId: z.string(),
})

// Schema para query de filtros
export const visitsQuerySchema = z.object({
  clientId: z.string().optional(),
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
export type CreateVisitDto = z.infer<typeof createVisitSchema>
export type UpdateVisitDto = z.infer<typeof updateVisitSchema>
export type VisitIdParam = z.infer<typeof visitIdParamSchema>
export type ClientIdParam = z.infer<typeof clientIdParamSchema>
export type VisitsQueryDto = z.infer<typeof visitsQuerySchema>
export type DateRangeQueryDto = z.infer<typeof dateRangeQuerySchema>
