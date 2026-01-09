import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createVaccinationItemSchema,
  petIdParamSchema,
  dateRangeQuerySchema,
} from './vaccination.schema'
import {
  createVaccinationItem,
  getPetVaccination,
  getVaccinationsByDateRange,
} from './vaccination.service'

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

export const getVaccinationsByDateRangeController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { startDate, endDate } = dateRangeQuerySchema.parse(req.query)
  const vaccinations = await getVaccinationsByDateRange(
    req.server.prisma,
    startDate,
    endDate
  )
  reply.send(vaccinations)
}
