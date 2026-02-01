import type { FastifyInstance } from 'fastify'
import type {
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
  MedicalRecordsQueryDto,
} from './medical-records.schema'

export const createMedicalRecord = (
  prisma: FastifyInstance['prisma'],
  data: CreateMedicalRecordDto,
) => {
  return prisma.medicalRecord.create({
    data,
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      pet: true,
      animalGroup: true,
    },
  })
}

export const getMedicalRecords = async (
  prisma: FastifyInstance['prisma'],
  query: MedicalRecordsQueryDto,
) => {
  const { page, limit, type, clientId } = query
  const skip = (page - 1) * limit

  const where = {
    isActive: true,
    ...(type && { type }),
    ...(clientId && { clientId }),
  }

  const [medicalRecords, total] = await Promise.all([
    prisma.medicalRecord.findMany({
      where,
      skip,
      take: limit,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        pet: true,
        animalGroup: true,
        _count: {
          select: {
            consultations: true,
            vaccinations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.medicalRecord.count({ where }),
  ])

  return {
    data: medicalRecords,
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

export const getClientMedicalRecords = (
  prisma: FastifyInstance['prisma'],
  clientId: string,
) => {
  return prisma.medicalRecord.findMany({
    where: {
      clientId,
      isActive: true,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      pet: true,
      animalGroup: true,
      _count: {
        select: {
          consultations: true,
          vaccinations: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const getSingleMedicalRecord = (
  prisma: FastifyInstance['prisma'],
  recordId: string,
) => {
  return prisma.medicalRecord.findFirst({
    where: {
      id: recordId,
      isActive: true,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
      },
      pet: true,
      animalGroup: true,
      consultations: {
        include: {
          veterinarian: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      },
      vaccinations: {
        include: {
          medication: true,
          veterinarian: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
      },
    },
  })
}

export const updateMedicalRecord = async (
  prisma: FastifyInstance['prisma'],
  recordId: string,
  data: UpdateMedicalRecordDto,
) => {
  const existingRecord = await prisma.medicalRecord.findFirst({
    where: { id: recordId, isActive: true },
  })

  if (!existingRecord) {
    return null
  }

  return prisma.medicalRecord.update({
    where: { id: recordId },
    data,
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      pet: true,
      animalGroup: true,
    },
  })
}

export const deleteMedicalRecord = async (
  prisma: FastifyInstance['prisma'],
  recordId: string,
) => {
  const existingRecord = await prisma.medicalRecord.findFirst({
    where: { id: recordId, isActive: true },
  })

  if (!existingRecord) {
    return null
  }

  return prisma.medicalRecord.update({
    where: { id: recordId },
    data: { isActive: false },
  })
}
