import type { FastifyInstance } from 'fastify'

import type {
  CreateVaccinationDto,
  UpdateVaccinationDto,
  VaccinationsQueryDto,
} from './vaccination.schema.js'

export const createVaccination = (
  prisma: FastifyInstance['prisma'],
  data: CreateVaccinationDto,
) => {
  return prisma.vaccination.create({
    data: {
      ...data,
      appliedAt: data.appliedAt,
      ...(data.nextDueDate && { nextDueDate: data.nextDueDate }),
    },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
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
      consultation: {
        select: {
          id: true,
          reason: true,
          visit: {
            select: {
              id: true,
              date: true,
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

export const getVaccinations = async (
  prisma: FastifyInstance['prisma'],
  query: VaccinationsQueryDto,
) => {
  const {
    page,
    limit,
    recordId,
    medicationId,
    veterinarianId,
    startDate,
    endDate,
  } = query
  const skip = (page - 1) * limit

  const where = {
    ...(recordId && { recordId }),
    ...(medicationId && { medicationId }),
    ...(veterinarianId && { veterinarianId }),
    ...(startDate &&
      endDate && {
        appliedAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
  }

  const [vaccinations, total] = await Promise.all([
    prisma.vaccination.findMany({
      where,
      skip,
      take: limit,
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            category: true,
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
        consultation: {
          select: {
            id: true,
            reason: true,
            visit: {
              select: {
                id: true,
                date: true,
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
      orderBy: { appliedAt: 'desc' },
    }),
    prisma.vaccination.count({ where }),
  ])

  return {
    data: vaccinations,
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

export const getRecordVaccinations = (
  prisma: FastifyInstance['prisma'],
  recordId: string,
) => {
  return prisma.vaccination.findMany({
    where: { recordId },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
          defaultIntervalDays: true,
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
      consultation: {
        select: {
          id: true,
          reason: true,
          visit: {
            select: {
              id: true,
              date: true,
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
    orderBy: { appliedAt: 'desc' },
  })
}

export const getVaccinationsByDateRange = (
  prisma: FastifyInstance['prisma'],
  startDate: Date,
  endDate: Date,
) => {
  return prisma.vaccination.findMany({
    where: {
      appliedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
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
      veterinarian: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { appliedAt: 'desc' },
  })
}

export const getUpcomingVaccinations = (
  prisma: FastifyInstance['prisma'],
  days: number = 30,
) => {
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days)

  return prisma.vaccination.findMany({
    where: {
      nextDueDate: {
        gte: new Date(),
        lte: endDate,
      },
    },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
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
              phone: true,
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
    orderBy: { nextDueDate: 'asc' },
  })
}

export const getSingleVaccination = (
  prisma: FastifyInstance['prisma'],
  vaccinationId: string,
) => {
  return prisma.vaccination.findUnique({
    where: { id: vaccinationId },
    include: {
      medication: true,
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
      consultation: {
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

export const updateVaccination = async (
  prisma: FastifyInstance['prisma'],
  vaccinationId: string,
  data: UpdateVaccinationDto,
) => {
  const existingVaccination = await prisma.vaccination.findUnique({
    where: { id: vaccinationId },
  })

  if (!existingVaccination) {
    return null
  }

  return prisma.vaccination.update({
    where: { id: vaccinationId },
    data: {
      ...data,
      ...(data.appliedAt && { appliedAt: data.appliedAt }),
      ...(data.nextDueDate && { nextDueDate: data.nextDueDate }),
    },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
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
      veterinarian: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export const deleteVaccination = async (
  prisma: FastifyInstance['prisma'],
  vaccinationId: string,
) => {
  const existingVaccination = await prisma.vaccination.findUnique({
    where: { id: vaccinationId },
  })

  if (!existingVaccination) {
    return null
  }

  return prisma.vaccination.delete({
    where: { id: vaccinationId },
  })
}
