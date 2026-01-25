import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createVaccinationItemSchema,
  petIdParamSchema,
  dateRangeQuerySchema,
  updateVaccinationSchema,
  vaccinationIdParamSchema,
} from './vaccination.schema'
import {
  createVaccinationItem,
  getPetVaccination,
  getVaccinationsByDateRange,
  updateVaccination,
  deleteVaccination,
} from './vaccination.service'

export const createVaccinationItemController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = createVaccinationItemSchema.parse(req.body)
  const vaccine = await createVaccinationItem(req.server.prisma, data)
  reply.code(201).send(vaccine)
}

export const getPetVaccinationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { petId } = petIdParamSchema.parse(req.params)
  const petVaccination = await getPetVaccination(req.server.prisma, petId)
  reply.send(petVaccination)
}

export const getVaccinationsByDateRangeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { startDate, endDate } = dateRangeQuerySchema.parse(req.query)
  const vaccinations = await getVaccinationsByDateRange(
    req.server.prisma,
    startDate,
    endDate,
  )
  reply.send(vaccinations)
}

export const updateVaccinationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: vaccinationId } = vaccinationIdParamSchema.parse(req.params)
  const data = updateVaccinationSchema.parse(req.body)
  const vaccination = await updateVaccination(
    req.server.prisma,
    vaccinationId,
    data,
  )
  if (!vaccination) {
    return reply.code(404).send({ message: 'Vaccination not found' })
  }
  reply.send(vaccination)
}

export const deleteVaccinationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: vaccinationId } = vaccinationIdParamSchema.parse(req.params)
  const vaccination = await deleteVaccination(req.server.prisma, vaccinationId)
  if (!vaccination) {
    return reply.code(404).send({ message: 'Vaccination not found' })
  }
  reply.code(204).send()
}
