import z from 'zod'
import { Sex, Species } from '../../generated/prisma/client.js'

export const createPetSchema = z.object({
  species: z.enum(Species),
  breed: z.string().optional(),
  sex: z.enum(Sex),
  birthDate: z.coerce.date().optional(),
  recordId: z.string().nonempty(),
  color: z.string().optional(),
  notes: z.string().optional(),
})

export const updatePetSchema = z.object({
  name: z.string().nonempty().optional(),
  species: z.enum(Species).optional(),
  breed: z.string().optional(),
  sex: z.enum(Sex).optional(),
  birthDate: z.coerce.date().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
})

export type CreatePetDto = z.infer<typeof createPetSchema>
export type UpdatePetDto = z.infer<typeof updatePetSchema>

export const petIdParamSchema = z.object({
  petId: z.string().nonempty(),
})

export const petsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  name: z.string().optional(),
  species: z.enum(Species).optional(),
  sex: z.enum(Sex).optional(),
  breed: z.string().optional(),
  clientId: z.string().optional(),

  sortBy: z
    .enum([
      'name',
      'species',
      'birthDate',
      'createdAt',
      'updatedAt',
      'breed',
      'sex',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type PetsQueryDto = z.infer<typeof petsQuerySchema>
