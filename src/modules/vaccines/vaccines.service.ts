import type { FastifyInstance } from 'fastify'

import type { Prisma } from '../../generated/prisma/client'

export const createVaccine = (
  prisma: FastifyInstance['prisma'],
  data: Prisma.VaccineCreateInput
) => {
  return prisma.vaccine.create({ data })
}

export const getVaccines = (prisma: FastifyInstance['prisma']) => {
  return prisma.vaccine.findMany()
}
