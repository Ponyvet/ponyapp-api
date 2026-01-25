import type { FastifyReply, FastifyRequest } from 'fastify'
import { getUserList, createUser } from './users.services'
import { createUserSchema } from './users.schema'

export const getUserListController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const users = await getUserList(req.server.prisma)
  reply.send(users)
}

export const createUserController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const data = createUserSchema.parse(req.body)
    const user = await createUser(req.server.prisma, data)
    reply.code(201).send(user)
  } catch (error) {
    if (error instanceof Error && error.message === 'Email already exists') {
      return reply.code(409).send({ message: 'Email already exists' })
    }
    throw error
  }
}
