import { z } from 'zod'
import { RecordType } from '../../generated/prisma/client.js'

// Schema para crear cartilla médica
export const createMedicalRecordSchema = z.object({
  type: z.enum(RecordType),
  name: z.string().min(1, 'Name is required'),
  notes: z.string().optional(),
  clientId: z.string(),
})

// Schema para actualizar cartilla médica
export const updateMedicalRecordSchema = z.object({
  type: z.enum(RecordType).optional(),
  name: z.string().min(1, 'Name is required').optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
})

// Schema para parámetros de ID
export const medicalRecordIdParamSchema = z.object({
  id: z.string(),
})

// Schema para parámetros de cliente ID
export const clientIdParamSchema = z.object({
  clientId: z.string(),
})

// Schema para query de filtros
export const medicalRecordsQuerySchema = z.object({
  type: z.enum(RecordType).optional(),
  clientId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

// Tipos TypeScript exportados
export type CreateMedicalRecordDto = z.infer<typeof createMedicalRecordSchema>
export type UpdateMedicalRecordDto = z.infer<typeof updateMedicalRecordSchema>
export type MedicalRecordIdParam = z.infer<typeof medicalRecordIdParamSchema>
export type ClientIdParam = z.infer<typeof clientIdParamSchema>
export type MedicalRecordsQueryDto = z.infer<typeof medicalRecordsQuerySchema>
