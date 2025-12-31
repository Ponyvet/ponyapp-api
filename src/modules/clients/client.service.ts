import type { FastifyInstance } from 'fastify'

import type { Prisma } from '../../generated/prisma/client'

export const createClient = (
  prisma: FastifyInstance['prisma'],
  data: Prisma.ClientCreateInput
) => {
  return prisma.client.create({ data })
}

export const getClients = (prisma: FastifyInstance['prisma']) => {
  return prisma.client.findMany()
}

export const getSingleClient = (
  prisma: FastifyInstance['prisma'],
  clientId: Prisma.ClientWhereUniqueInput['id']
) => {
  return prisma.client.findUnique({
    where: { id: clientId },
  })
}
