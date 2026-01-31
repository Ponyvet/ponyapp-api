import { z } from 'zod'
import { InventoryCategory } from '../../generated/prisma/client'

// Schema para crear artículo de inventario
export const createInventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(InventoryCategory),
  unit: z.string().min(1, 'Unit is required'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  expirationDate: z.coerce.date().optional(),
  medicationId: z.string().optional(),
})

// Schema para actualizar artículo de inventario
export const updateInventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  category: z.enum(InventoryCategory).optional(),
  unit: z.string().min(1, 'Unit is required').optional(),
  quantity: z.number().int().min(0, 'Quantity must be non-negative').optional(),
  expirationDate: z.coerce.date().optional(),
  medicationId: z.string().optional(),
  isActive: z.boolean().optional(),
})

// Schema para ajustar inventario (sumar/restar cantidad)
export const adjustInventorySchema = z.object({
  quantity: z.number().int().min(-999999, 'Invalid quantity adjustment'),
  reason: z.string().optional(),
})

// Schema para parámetros de ID
export const inventoryItemIdParamSchema = z.object({
  id: z.string(),
})

// Schema para query de filtros
export const inventoryQuerySchema = z.object({
  category: z.enum(InventoryCategory).optional(),
  medicationId: z.string().optional(),
  lowStock: z.coerce.number().int().positive().optional(), // Mostrar items con stock menor a este número
  expiringSoon: z.coerce.number().int().positive().optional(), // Items que expiran en X días
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

// Tipos TypeScript exportados
export type CreateInventoryItemDto = z.infer<typeof createInventoryItemSchema>
export type UpdateInventoryItemDto = z.infer<typeof updateInventoryItemSchema>
export type AdjustInventoryDto = z.infer<typeof adjustInventorySchema>
export type InventoryItemIdParam = z.infer<typeof inventoryItemIdParamSchema>
export type InventoryQueryDto = z.infer<typeof inventoryQuerySchema>
