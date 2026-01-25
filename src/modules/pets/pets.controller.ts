import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createPetSchema,
  petIdParamSchema,
  updatePetSchema,
  petsQuerySchema,
} from './pets.schema'
import {
  createPet,
  getClientPets,
  getAllPets,
  getSinglePet,
  updatePet,
  deletePet,
} from './pets.service'

export const createPetController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = createPetSchema.parse(req.body)
  const pet = await createPet(req.server.prisma, data)
  reply.code(201).send(pet)
}

export const getClientPetsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const clientId = req.params as { clientId: string }
  const pets = await getClientPets(req.server.prisma, clientId.clientId)
  reply.send(pets)
}

export const getAllPetsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = petsQuerySchema.parse(req.query)
  const result = await getAllPets(req.server.prisma, query)
  reply.send(result)
}

export const getSinglePetController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { petId } = petIdParamSchema.parse(req.params)
  const pet = await getSinglePet(req.server.prisma, { id: petId })
  if (!pet) {
    return reply.code(404).send({ message: 'Pet not found' })
  }
  reply.send(pet)
}

export const updatePetController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { petId } = petIdParamSchema.parse(req.params)
  const data = updatePetSchema.parse(req.body)
  const pet = await updatePet(req.server.prisma, petId, data)
  if (!pet) {
    return reply.code(404).send({ message: 'Pet not found' })
  }
  reply.send(pet)
}

export const deletePetController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { petId } = petIdParamSchema.parse(req.params)
  const pet = await deletePet(req.server.prisma, petId)
  if (!pet) {
    return reply.code(404).send({ message: 'Pet not found' })
  }
  reply.code(204).send()
}
