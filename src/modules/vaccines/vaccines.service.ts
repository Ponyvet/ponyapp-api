import type { FastifyInstance } from 'fastify'

import type { Prisma } from '../../generated/prisma/client'

export const createVaccine = (
  prisma: FastifyInstance['prisma'],
  data: Prisma.VaccineCreateInput,
) => {
  return prisma.vaccine.create({ data })
}

export const getVaccines = (prisma: FastifyInstance['prisma']) => {
  return prisma.vaccine.findMany({
    where: { isActive: true },
  })
}

export const updateVaccine = async (
  prisma: FastifyInstance['prisma'],
  vaccineId: string,
  data: Prisma.VaccineUpdateInput,
) => {
  const existingVaccine = await prisma.vaccine.findFirst({
    where: { id: vaccineId, isActive: true },
  })

  if (!existingVaccine) {
    return null
  }

  return prisma.vaccine.update({
    where: { id: vaccineId },
    data,
  })
}

export const deleteVaccine = async (
  prisma: FastifyInstance['prisma'],
  vaccineId: string,
) => {
  const existingVaccine = await prisma.vaccine.findFirst({
    where: { id: vaccineId, isActive: true },
  })

  if (!existingVaccine) {
    return null
  }

  return prisma.vaccine.update({
    where: { id: vaccineId },
    data: { isActive: false },
  })
}
