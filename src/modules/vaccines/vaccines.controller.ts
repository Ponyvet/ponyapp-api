import type { FastifyReply, FastifyRequest } from 'fastify'

import { createVaccineSchema } from './vaccines.schema'
import { createVaccine, getVaccines } from './vaccines.service'

export const createVaccineController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const data = createVaccineSchema.parse(req.body)
  const vaccine = await createVaccine(req.server.prisma, data)
  reply.code(201).send(vaccine)
}

export const getVaccinesController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const vaccines = await getVaccines(req.server.prisma)
  reply.send(vaccines)
}
