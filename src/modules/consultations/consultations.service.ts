import type { FastifyInstance } from 'fastify'
import type {
  CreateConsultationDto,
  UpdateConsultationDto,
  ConsultationsQueryDto,
} from './consultations.schema'

export const createConsultation = (
  prisma: FastifyInstance['prisma'],
  data: CreateConsultationDto,
) => {
  return prisma.consultation.create({
    data,
    include: {
      visit: {
        select: {
          id: true,
          date: true,
          veterinarian: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      record: {
        select: {
          id: true,
          name: true,
          type: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })
}

export const getConsultations = async (
  prisma: FastifyInstance['prisma'],
  query: ConsultationsQueryDto,
) => {
  const { page, limit, recordId, visitId } = query
  const skip = (page - 1) * limit

  const where = {
    ...(recordId && { recordId }),
    ...(visitId && { visitId }),
  }

  const [consultations, total] = await Promise.all([
    prisma.consultation.findMany({
      where,
      skip,
      take: limit,
      include: {
        visit: {
          select: {
            id: true,
            date: true,
            veterinarian: {
              select: {
                id: true,
                name: true,
              },
            },
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        record: {
          select: {
            id: true,
            name: true,
            type: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.consultation.count({ where }),
  ])

  return {
    data: consultations,
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

export const getRecordConsultations = (
  prisma: FastifyInstance['prisma'],
  recordId: string,
) => {
  return prisma.consultation.findMany({
    where: { recordId },
    include: {
      visit: {
        select: {
          id: true,
          date: true,
          veterinarian: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      vaccinations: {
        include: {
          medication: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const getSingleConsultation = (
  prisma: FastifyInstance['prisma'],
  consultationId: string,
) => {
  return prisma.consultation.findUnique({
    where: { id: consultationId },
    include: {
      visit: {
        include: {
          client: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          veterinarian: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      record: {
        include: {
          pet: true,
          animalGroup: true,
        },
      },
      vaccinations: {
        include: {
          medication: true,
        },
      },
    },
  })
}

export const updateConsultation = async (
  prisma: FastifyInstance['prisma'],
  consultationId: string,
  data: UpdateConsultationDto,
) => {
  const existingConsultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
  })

  if (!existingConsultation) {
    return null
  }

  return prisma.consultation.update({
    where: { id: consultationId },
    data,
    include: {
      visit: {
        select: {
          id: true,
          date: true,
          veterinarian: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      record: {
        select: {
          id: true,
          name: true,
          type: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })
}

export const deleteConsultation = async (
  prisma: FastifyInstance['prisma'],
  consultationId: string,
) => {
  const existingConsultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
  })

  if (!existingConsultation) {
    return null
  }

  return prisma.consultation.delete({
    where: { id: consultationId },
  })
}
