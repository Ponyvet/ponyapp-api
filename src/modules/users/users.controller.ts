import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  getUserList,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} from './users.services.js'
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from './users.schema.js'

export const getUserListController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const users = await getUserList(req.server.prisma)
  reply.send(users)
}

export const getSingleUserController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: userId } = userIdParamSchema.parse(req.params)
  const user = await getSingleUser(req.server.prisma, userId)

  if (!user) {
    return reply.code(404).send({ message: 'User not found' })
  }

  reply.send(user)
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
    if (error instanceof Error) {
      if (error.message === 'Email already exists') {
        return reply.code(409).send({ message: 'Email already exists' })
      }
      if (error.message === 'CLIENT users must have a clientId') {
        return reply
          .code(400)
          .send({ message: 'CLIENT users must have a clientId' })
      }
      if (error.message === 'Client not found') {
        return reply.code(404).send({ message: 'Client not found' })
      }
      if (error.message === 'Client already has a user account') {
        return reply
          .code(409)
          .send({ message: 'Client already has a user account' })
      }
    }
    throw error
  }
}

export const updateUserController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id: userId } = userIdParamSchema.parse(req.params)
    const data = updateUserSchema.parse(req.body)
    const user = await updateUser(req.server.prisma, userId, data)

    if (!user) {
      return reply.code(404).send({ message: 'User not found' })
    }

    reply.send(user)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Email already exists') {
        return reply.code(409).send({ message: 'Email already exists' })
      }
      if (error.message === 'Client not found') {
        return reply.code(404).send({ message: 'Client not found' })
      }
      if (error.message === 'Client already has a user account') {
        return reply
          .code(409)
          .send({ message: 'Client already has a user account' })
      }
    }
    throw error
  }
}

export const deleteUserController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: userId } = userIdParamSchema.parse(req.params)
  const user = await deleteUser(req.server.prisma, userId, req.headers)

  if (!user) {
    return reply.code(404).send({ message: 'User not found' })
  }

  reply.code(204).send()
}
