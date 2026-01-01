import type { FastifyInstance } from 'fastify'

export const getUserList = (prisma: FastifyInstance['prisma']) => {
  return prisma.user.findMany({ select: { id: true, name: true } })
}
