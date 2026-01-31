import type { FastifyInstance } from 'fastify'
import type {
  CreateConsultationDto,
  UpdateConsultationDto,
  ConsultationsQueryDto,
  DateRangeQueryDto as _DateRangeQueryDto,
} from './consultations.schema'

export const createConsultation = (
  prisma: FastifyInstance['prisma'],
  data: CreateConsultationDto,
) => {
  return prisma.consultation.create({
    data: {
      ...data,
      date: data.date || new Date(),
    },
    include: {
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
      veterinarian: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export const getConsultations = async (
  prisma: FastifyInstance['prisma'],
  query: ConsultationsQueryDto,
) => {
  const { page, limit, recordId, veterinarianId, startDate, endDate } = query
  const skip = (page - 1) * limit

  const where = {
    ...(recordId && { recordId }),
    ...(veterinarianId && { veterinarianId }),
    ...(startDate &&
      endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
  }

  const [consultations, total] = await Promise.all([
    prisma.consultation.findMany({
      where,
      skip,
      take: limit,
      include: {
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
        veterinarian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: 'desc' },
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
      veterinarian: {
        select: {
          id: true,
          name: true,
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
    orderBy: { date: 'desc' },
  })
}

export const getConsultationsByDateRange = (
  prisma: FastifyInstance['prisma'],
  startDate: Date,
  endDate: Date,
) => {
  return prisma.consultation.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
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
      veterinarian: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  })
}

export const getSingleConsultation = (
  prisma: FastifyInstance['prisma'],
  consultationId: string,
) => {
  return prisma.consultation.findUnique({
    where: { id: consultationId },
    include: {
      record: {
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
      },
      veterinarian: {
        select: {
          id: true,
          name: true,
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
    data: {
      ...data,
      ...(data.date && { date: data.date }),
    },
    include: {
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
      veterinarian: {
        select: {
          id: true,
          name: true,
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
