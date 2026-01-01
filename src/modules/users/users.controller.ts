import type { FastifyReply, FastifyRequest } from 'fastify'
import { getUserList } from './users.services'

export const getUserListController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const users = await getUserList(req.server.prisma)
  reply.send(users)
}
