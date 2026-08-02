import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createConsultationSchema,
  updateConsultationSchema,
  consultationIdParamSchema,
  recordIdParamSchema,
  consultationsQuerySchema,
} from './consultations.schema.js'
import {
  createConsultation,
  getConsultations,
  getRecordConsultations,
  getSingleConsultation,
  updateConsultation,
  deleteConsultation,
} from './consultations.service.js'

export const createConsultationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = createConsultationSchema.parse(req.body)
  const consultation = await createConsultation(req.server.prisma, data)
  reply.code(201).send(consultation)
}

export const getConsultationsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = consultationsQuerySchema.parse(req.query)
  const result = await getConsultations(req.server.prisma, query)
  reply.send(result)
}

export const getRecordConsultationsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { recordId } = recordIdParamSchema.parse(req.params)
  const consultations = await getRecordConsultations(
    req.server.prisma,
    recordId,
  )
  reply.send(consultations)
}

export const getSingleConsultationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: consultationId } = consultationIdParamSchema.parse(req.params)
  const consultation = await getSingleConsultation(
    req.server.prisma,
    consultationId,
  )

  if (!consultation) {
    return reply.code(404).send({ message: 'Consultation not found' })
  }

  reply.send(consultation)
}

export const updateConsultationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: consultationId } = consultationIdParamSchema.parse(req.params)
  const data = updateConsultationSchema.parse(req.body)
  const consultation = await updateConsultation(
    req.server.prisma,
    consultationId,
    data,
  )

  if (!consultation) {
    return reply.code(404).send({ message: 'Consultation not found' })
  }

  reply.send(consultation)
}

export const deleteConsultationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: consultationId } = consultationIdParamSchema.parse(req.params)
  const consultation = await deleteConsultation(
    req.server.prisma,
    consultationId,
  )

  if (!consultation) {
    return reply.code(404).send({ message: 'Consultation not found' })
  }

  reply.code(204).send()
}
