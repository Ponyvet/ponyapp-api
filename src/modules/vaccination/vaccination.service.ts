import type { FastifyInstance } from 'fastify'

import type { CreateVaccinationDto } from './vaccination.schema'

export const createVaccinationItem = (
  prisma: FastifyInstance['prisma'],
  data: CreateVaccinationDto
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
  petId: CreateVaccinationDto['petId']
) => {
  return prisma.vaccination.findMany({
    where: { petId },
  })
}
