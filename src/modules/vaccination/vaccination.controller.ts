import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createVaccinationItemSchema,
  petIdParamSchema,
} from './vaccination.schema'
import { createVaccinationItem, getPetVaccination } from './vaccination.service'

export const createVaccinationItemController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const data = createVaccinationItemSchema.parse(req.body)
  const vaccine = await createVaccinationItem(req.server.prisma, data)
  reply.code(201).send(vaccine)
}

export const getPetVaccinationController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { petId } = petIdParamSchema.parse(req.params)
  const petVaccination = await getPetVaccination(req.server.prisma, petId)
  reply.send(petVaccination)
}
