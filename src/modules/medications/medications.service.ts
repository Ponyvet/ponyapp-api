import type { FastifyInstance } from 'fastify'
import type {
  CreateMedicationDto,
  UpdateMedicationDto,
  MedicationsQueryDto,
} from './medications.schema'

export const createMedication = (
  prisma: FastifyInstance['prisma'],
  data: CreateMedicationDto,
) => {
  return prisma.medication.create({
    data,
  })
}

export const getMedications = async (
  prisma: FastifyInstance['prisma'],
  query: MedicationsQueryDto,
) => {
  const { page, limit, category, species, search } = query
  const skip = (page - 1) * limit

  const where = {
    isActive: true,
    ...(category && { category }),
    ...(species && { species }),
    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive' as const,
      },
    }),
  }

  const [medications, total] = await Promise.all([
    prisma.medication.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            vaccinations: true,
            inventoryItems: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.medication.count({ where }),
  ])

  return {
    data: medications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}

export const getAllActiveMedications = (prisma: FastifyInstance['prisma']) => {
  return prisma.medication.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

export const getMedicationsByCategory = (
  prisma: FastifyInstance['prisma'],
  category: string,
) => {
  return prisma.medication.findMany({
    where: {
      isActive: true,
      category: category as unknown as Record<string, unknown>,
    },
    orderBy: { name: 'asc' },
  })
}

export const getSingleMedication = (
  prisma: FastifyInstance['prisma'],
  medicationId: string,
) => {
  return prisma.medication.findFirst({
    where: {
      id: medicationId,
      isActive: true,
    },
    include: {
      vaccinations: {
        take: 10,
        include: {
          record: {
            select: {
              id: true,
              name: true,
              client: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
      },
      inventoryItems: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          vaccinations: true,
          inventoryItems: true,
        },
      },
    },
  })
}

export const updateMedication = async (
  prisma: FastifyInstance['prisma'],
  medicationId: string,
  data: UpdateMedicationDto,
) => {
  const existingMedication = await prisma.medication.findFirst({
    where: { id: medicationId, isActive: true },
  })

  if (!existingMedication) {
    return null
  }

  return prisma.medication.update({
    where: { id: medicationId },
    data,
  })
}

export const deleteMedication = async (
  prisma: FastifyInstance['prisma'],
  medicationId: string,
) => {
  const existingMedication = await prisma.medication.findFirst({
    where: { id: medicationId, isActive: true },
  })

  if (!existingMedication) {
    return null
  }

  // Verificar si tiene vacunaciones asociadas
  const vaccinationsCount = await prisma.vaccination.count({
    where: { medicationId },
  })

  if (vaccinationsCount > 0) {
    // Solo desactivar si hay vacunaciones asociadas
    return prisma.medication.update({
      where: { id: medicationId },
      data: { isActive: false },
    })
  }

  // Si no hay vacunaciones, se puede eliminar completamente
  return prisma.medication.delete({
    where: { id: medicationId },
  })
}
