import { z } from 'zod'
import { MedicationCategory, Species } from '../../generated/prisma/client.js'

// Schema para crear medicamento
export const createMedicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(MedicationCategory),
  species: z.enum(Species).optional(),
  defaultIntervalDays: z.number().int().positive().optional(),
  notes: z.string().optional(),
})

// Schema para actualizar medicamento
export const updateMedicationSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  category: z.enum(MedicationCategory).optional(),
  species: z.enum(Species).optional(),
  defaultIntervalDays: z.number().int().positive().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
})

// Schema para parámetros de ID
export const medicationIdParamSchema = z.object({
  id: z.string(),
})

// Schema para query de filtros
export const medicationsQuerySchema = z.object({
  category: z.enum(MedicationCategory).optional(),
  species: z.enum(Species).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

// Tipos TypeScript exportados
export type CreateMedicationDto = z.infer<typeof createMedicationSchema>
export type UpdateMedicationDto = z.infer<typeof updateMedicationSchema>
export type MedicationIdParam = z.infer<typeof medicationIdParamSchema>
export type MedicationsQueryDto = z.infer<typeof medicationsQuerySchema>
