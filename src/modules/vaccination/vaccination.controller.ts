import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createVaccinationSchema,
  recordIdParamSchema,
  dateRangeQuerySchema,
  updateVaccinationSchema,
  vaccinationIdParamSchema,
  vaccinationsQuerySchema,
} from './vaccination.schema'
import {
  createVaccination,
  getVaccinations,
  getRecordVaccinations,
  getVaccinationsByDateRange,
  getUpcomingVaccinations,
  getSingleVaccination,
  updateVaccination,
  deleteVaccination,
} from './vaccination.service'

export const createVaccinationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = createVaccinationSchema.parse(req.body)
  const vaccination = await createVaccination(req.server.prisma, data)
  reply.code(201).send(vaccination)
}

export const getVaccinationsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = vaccinationsQuerySchema.parse(req.query)
  const result = await getVaccinations(req.server.prisma, query)
  reply.send(result)
}

export const getRecordVaccinationsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { recordId } = recordIdParamSchema.parse(req.params)
  const vaccinations = await getRecordVaccinations(req.server.prisma, recordId)
  reply.send(vaccinations)
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

export const getUpcomingVaccinationsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { days } = req.query as { days?: string }
  const daysNum = days ? parseInt(days) : 30
  const vaccinations = await getUpcomingVaccinations(req.server.prisma, daysNum)
  reply.send(vaccinations)
}

export const getSingleVaccinationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: vaccinationId } = vaccinationIdParamSchema.parse(req.params)
  const vaccination = await getSingleVaccination(
    req.server.prisma,
    vaccinationId,
  )

  if (!vaccination) {
    return reply.code(404).send({ message: 'Vaccination not found' })
  }

  reply.send(vaccination)
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
