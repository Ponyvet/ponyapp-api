import type { FastifyReply, FastifyRequest } from 'fastify'

import { createClientSchema } from './client.schema'
import { createClient, getClients } from './client.service'

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
