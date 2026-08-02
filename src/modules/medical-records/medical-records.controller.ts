import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
  medicalRecordIdParamSchema,
  clientIdParamSchema,
  medicalRecordsQuerySchema,
} from './medical-records.schema.js'
import {
  createMedicalRecord,
  getMedicalRecords,
  getClientMedicalRecords,
  getSingleMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from './medical-records.service.js'

export const createMedicalRecordController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = createMedicalRecordSchema.parse(req.body)
  const medicalRecord = await createMedicalRecord(req.server.prisma, data)
  reply.code(201).send(medicalRecord)
}

export const getMedicalRecordsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = medicalRecordsQuerySchema.parse(req.query)
  const result = await getMedicalRecords(req.server.prisma, query)
  reply.send(result)
}

export const getClientMedicalRecordsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { clientId } = clientIdParamSchema.parse(req.params)
  const medicalRecords = await getClientMedicalRecords(
    req.server.prisma,
    clientId,
  )
  reply.send(medicalRecords)
}

export const getSingleMedicalRecordController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: recordId } = medicalRecordIdParamSchema.parse(req.params)
  const medicalRecord = await getSingleMedicalRecord(
    req.server.prisma,
    recordId,
  )

  if (!medicalRecord) {
    return reply.code(404).send({ message: 'Medical record not found' })
  }

  reply.send(medicalRecord)
}

export const updateMedicalRecordController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: recordId } = medicalRecordIdParamSchema.parse(req.params)
  const data = updateMedicalRecordSchema.parse(req.body)
  const medicalRecord = await updateMedicalRecord(
    req.server.prisma,
    recordId,
    data,
  )

  if (!medicalRecord) {
    return reply.code(404).send({ message: 'Medical record not found' })
  }

  reply.send(medicalRecord)
}

export const deleteMedicalRecordController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: recordId } = medicalRecordIdParamSchema.parse(req.params)
  const medicalRecord = await deleteMedicalRecord(req.server.prisma, recordId)

  if (!medicalRecord) {
    return reply.code(404).send({ message: 'Medical record not found' })
  }

  reply.code(204).send()
}
