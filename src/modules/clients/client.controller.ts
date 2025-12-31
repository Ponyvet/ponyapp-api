import type { FastifyReply, FastifyRequest } from 'fastify'

import { clientIdParamSchema, createClientSchema } from './client.schema'
import { createClient, getClients, getSingleClient } from './client.service'

export const createClientController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const data = createClientSchema.parse(req.body)
  const client = await createClient(req.server.prisma, data)
  reply.code(201).send(client)
}

export const getClientsController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const clients = await getClients(req.server.prisma)
  reply.send(clients)
}

export const getSingleClientController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id: clientId } = clientIdParamSchema.parse(req.params)
  const client = await getSingleClient(req.server.prisma, clientId)
  if (!client) {
    return reply.code(404).send({ message: 'Client not found' })
  }
  reply.send(client)
}
