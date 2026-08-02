import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createVisitSchema,
  updateVisitSchema,
  visitIdParamSchema,
  clientIdParamSchema,
  visitsQuerySchema,
  dateRangeQuerySchema,
} from './visits.schema.js'
import {
  createVisit,
  getVisits,
  getClientVisits,
  getVisitsByDateRange,
  getSingleVisit,
  updateVisit,
  deleteVisit,
} from './visits.service.js'

export const createVisitController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = createVisitSchema.parse(req.body)
  const visit = await createVisit(req.server.prisma, data)
  reply.code(201).send(visit)
}

export const getVisitsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = visitsQuerySchema.parse(req.query)
  const result = await getVisits(req.server.prisma, query)
  reply.send(result)
}

export const getClientVisitsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { clientId } = clientIdParamSchema.parse(req.params)
  const visits = await getClientVisits(req.server.prisma, clientId)
  reply.send(visits)
}

export const getVisitsByDateRangeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { startDate, endDate } = dateRangeQuerySchema.parse(req.query)
  const visits = await getVisitsByDateRange(
    req.server.prisma,
    startDate,
    endDate,
  )
  reply.send(visits)
}

export const getSingleVisitController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: visitId } = visitIdParamSchema.parse(req.params)
  const visit = await getSingleVisit(req.server.prisma, visitId)

  if (!visit) {
    return reply.code(404).send({ message: 'Visit not found' })
  }

  reply.send(visit)
}

export const updateVisitController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: visitId } = visitIdParamSchema.parse(req.params)
  const data = updateVisitSchema.parse(req.body)
  const visit = await updateVisit(req.server.prisma, visitId, data)

  if (!visit) {
    return reply.code(404).send({ message: 'Visit not found' })
  }

  reply.send(visit)
}

export const deleteVisitController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: visitId } = visitIdParamSchema.parse(req.params)
  const visit = await deleteVisit(req.server.prisma, visitId)

  if (!visit) {
    return reply.code(404).send({ message: 'Visit not found' })
  }

  reply.code(204).send()
}
