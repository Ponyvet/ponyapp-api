import type { FastifyInstance } from 'fastify'
import type {
  CreateVisitDto,
  UpdateVisitDto,
  VisitsQueryDto,
} from './visits.schema.js'

export const createVisit = (
  prisma: FastifyInstance['prisma'],
  data: CreateVisitDto,
) => {
  return prisma.visit.create({
    data: {
      ...data,
      date: data.date || new Date(),
    },
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
      consultations: {
        include: {
          record: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },
  })
}

export const getVisits = async (
  prisma: FastifyInstance['prisma'],
  query: VisitsQueryDto,
) => {
  const { page, limit, clientId, veterinarianId, startDate, endDate } = query
  const skip = (page - 1) * limit

  const where = {
    ...(clientId && { clientId }),
    ...(veterinarianId && { veterinarianId }),
    ...(startDate &&
      endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
  }

  const [visits, total] = await Promise.all([
    prisma.visit.findMany({
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
        veterinarian: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            consultations: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    }),
    prisma.visit.count({ where }),
  ])

  return {
    data: visits,
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

export const getClientVisits = (
  prisma: FastifyInstance['prisma'],
  clientId: string,
) => {
  return prisma.visit.findMany({
    where: { clientId },
    include: {
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
      consultations: {
        include: {
          record: {
            select: {
              id: true,
              name: true,
              type: true,
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
      },
    },
    orderBy: { date: 'desc' },
  })
}

export const getVisitsByDateRange = (
  prisma: FastifyInstance['prisma'],
  startDate: Date,
  endDate: Date,
) => {
  return prisma.visit.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
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
      _count: {
        select: {
          consultations: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  })
}

export const getSingleVisit = (
  prisma: FastifyInstance['prisma'],
  visitId: string,
) => {
  return prisma.visit.findUnique({
    where: { id: visitId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
      },
      veterinarian: {
        select: {
          id: true,
          name: true,
        },
      },
      consultations: {
        include: {
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
      },
    },
  })
}

export const updateVisit = async (
  prisma: FastifyInstance['prisma'],
  visitId: string,
  data: UpdateVisitDto,
) => {
  const existingVisit = await prisma.visit.findUnique({
    where: { id: visitId },
  })

  if (!existingVisit) {
    return null
  }

  return prisma.visit.update({
    where: { id: visitId },
    data,
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
      consultations: {
        include: {
          record: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },
  })
}

export const deleteVisit = async (
  prisma: FastifyInstance['prisma'],
  visitId: string,
) => {
  const existingVisit = await prisma.visit.findUnique({
    where: { id: visitId },
  })

  if (!existingVisit) {
    return null
  }

  return prisma.visit.delete({
    where: { id: visitId },
  })
}
