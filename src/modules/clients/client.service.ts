import type { FastifyInstance } from 'fastify'

import type { Prisma } from '../../generated/prisma/client'

export const createClient = (
  prisma: FastifyInstance['prisma'],
  data: Prisma.ClientCreateInput,
) => {
  return prisma.client.create({ data })
}

export const getClients = (prisma: FastifyInstance['prisma']) => {
  return prisma.client.findMany({
    where: { isActive: true },
  })
}

export const getSingleClient = (
  prisma: FastifyInstance['prisma'],
  clientId: Prisma.ClientWhereUniqueInput['id'],
) => {
  return prisma.client.findFirst({
    where: {
      id: clientId,
      isActive: true,
    },
  })
}

export const updateClient = async (
  prisma: FastifyInstance['prisma'],
  clientId: string,
  data: Prisma.ClientUpdateInput,
) => {
  const existingClient = await prisma.client.findFirst({
    where: { id: clientId, isActive: true },
  })

  if (!existingClient) {
    return null
  }

  return prisma.client.update({
    where: { id: clientId },
    data,
  })
}

export const deleteClient = async (
  prisma: FastifyInstance['prisma'],
  clientId: string,
) => {
  const existingClient = await prisma.client.findFirst({
    where: { id: clientId, isActive: true },
  })

  if (!existingClient) {
    return null
  }

  return prisma.client.update({
    where: { id: clientId },
    data: { isActive: false },
  })
}
