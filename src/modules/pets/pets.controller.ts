import type { FastifyReply, FastifyRequest } from 'fastify'

import { createPetSchema } from './pets.schema'
import { createPet, getClientPets } from './pets.service'

export const createPetController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const data = createPetSchema.parse(req.body)
  const pet = await createPet(req.server.prisma, data)
  reply.code(201).send(pet)
}

export const getClientPetsController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const clientId = req.params as { clientId: string }
  const pets = await getClientPets(req.server.prisma, clientId.clientId)
  reply.send(pets)
}
