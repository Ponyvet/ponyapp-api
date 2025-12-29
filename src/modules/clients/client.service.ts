import { FastifyInstance } from 'fastify'

import { Prisma } from '../../generated/prisma/client'

export const createClient = async (
  prisma: FastifyInstance['prisma'],
  data: Prisma.ClientCreateInput
) => {
  return prisma.client.create({ data })
}

export const getClients = async (prisma: FastifyInstance['prisma']) => {
  return prisma.client.findMany()
}
