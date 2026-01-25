import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createVaccineSchema,
  updateVaccineSchema,
  vaccineIdParamSchema,
} from './vaccines.schema'
import {
  createVaccine,
  getVaccines,
  updateVaccine,
  deleteVaccine,
} from './vaccines.service'

export const createVaccineController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = createVaccineSchema.parse(req.body)
  const vaccine = await createVaccine(req.server.prisma, data)
  reply.code(201).send(vaccine)
}

export const getVaccinesController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const vaccines = await getVaccines(req.server.prisma)
  reply.send(vaccines)
}

export const updateVaccineController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: vaccineId } = vaccineIdParamSchema.parse(req.params)
  const data = updateVaccineSchema.parse(req.body)
  const vaccine = await updateVaccine(req.server.prisma, vaccineId, data)
  if (!vaccine) {
    return reply.code(404).send({ message: 'Vaccine not found' })
  }
  reply.send(vaccine)
}

export const deleteVaccineController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: vaccineId } = vaccineIdParamSchema.parse(req.params)
  const vaccine = await deleteVaccine(req.server.prisma, vaccineId)
  if (!vaccine) {
    return reply.code(404).send({ message: 'Vaccine not found' })
  }
  reply.code(204).send()
}
