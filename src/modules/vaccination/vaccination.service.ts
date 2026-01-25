import type { FastifyInstance } from 'fastify'

import type {
  CreateVaccinationDto,
  UpdateVaccinationDto,
} from './vaccination.schema'

export const createVaccinationItem = (
  prisma: FastifyInstance['prisma'],
  data: CreateVaccinationDto,
) => {
  return prisma.vaccination.create({
    data: {
      appliedAt: data.appliedAt,
      nextDueDate: data.nextDueDate,
      status: data.status,
      pet: { connect: { id: data.petId } },
      vaccine: { connect: { id: data.vaccineId } },
      veterinarian: { connect: { id: data.veterinarianId } },
    },
  })
}

export const getPetVaccination = (
  prisma: FastifyInstance['prisma'],
  petId: CreateVaccinationDto['petId'],
) => {
  return prisma.vaccination.findMany({
    where: {
      petId,
      isActive: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export const getVaccinationsByDateRange = (
  prisma: FastifyInstance['prisma'],
  startDate: Date,
  endDate: Date,
) => {
  return prisma.vaccination.findMany({
    where: {
      nextDueDate: {
        gte: startDate,
        lte: endDate,
      },
      isActive: true,
    },
    include: {
      pet: true,
      vaccine: true,
    },
    orderBy: {
      appliedAt: 'desc',
    },
  })
}

export const updateVaccination = async (
  prisma: FastifyInstance['prisma'],
  vaccinationId: string,
  data: UpdateVaccinationDto,
) => {
  const existingVaccination = await prisma.vaccination.findFirst({
    where: { id: vaccinationId, isActive: true },
  })

  if (!existingVaccination) {
    return null
  }

  return prisma.vaccination.update({
    where: { id: vaccinationId },
    data,
  })
}

export const deleteVaccination = async (
  prisma: FastifyInstance['prisma'],
  vaccinationId: string,
) => {
  const existingVaccination = await prisma.vaccination.findFirst({
    where: { id: vaccinationId, isActive: true },
  })

  if (!existingVaccination) {
    return null
  }

  return prisma.vaccination.update({
    where: { id: vaccinationId },
    data: { isActive: false },
  })
}
