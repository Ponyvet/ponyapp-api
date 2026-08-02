import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createMedicationSchema,
  updateMedicationSchema,
  medicationIdParamSchema,
  medicationsQuerySchema,
} from './medications.schema.js'
import {
  createMedication,
  getMedications,
  getAllActiveMedications,
  getMedicationsByCategory,
  getSingleMedication,
  updateMedication,
  deleteMedication,
} from './medications.service.js'

export const createMedicationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = createMedicationSchema.parse(req.body)
  const medication = await createMedication(req.server.prisma, data)
  reply.code(201).send(medication)
}

export const getMedicationsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = medicationsQuerySchema.parse(req.query)
  const result = await getMedications(req.server.prisma, query)
  reply.send(result)
}

export const getAllActiveMedicationsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const medications = await getAllActiveMedications(req.server.prisma)
  reply.send(medications)
}

export const getMedicationsByCategoryController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { category } = req.params as { category: string }
  const medications = await getMedicationsByCategory(
    req.server.prisma,
    category,
  )
  reply.send(medications)
}

export const getSingleMedicationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: medicationId } = medicationIdParamSchema.parse(req.params)
  const medication = await getSingleMedication(req.server.prisma, medicationId)

  if (!medication) {
    return reply.code(404).send({ message: 'Medication not found' })
  }

  reply.send(medication)
}

export const updateMedicationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: medicationId } = medicationIdParamSchema.parse(req.params)
  const data = updateMedicationSchema.parse(req.body)
  const medication = await updateMedication(
    req.server.prisma,
    medicationId,
    data,
  )

  if (!medication) {
    return reply.code(404).send({ message: 'Medication not found' })
  }

  reply.send(medication)
}

export const deleteMedicationController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: medicationId } = medicationIdParamSchema.parse(req.params)
  const medication = await deleteMedication(req.server.prisma, medicationId)

  if (!medication) {
    return reply.code(404).send({ message: 'Medication not found' })
  }

  reply.code(204).send()
}
