import type { FastifyInstance } from 'fastify'

import {
  createConsultationController,
  getConsultationsController,
  getRecordConsultationsController,
  getConsultationsByDateRangeController,
  getSingleConsultationController,
  updateConsultationController,
  deleteConsultationController,
} from './consultations.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createConsultationController)
  app.get('/', getConsultationsController)
  app.get('/date-range', getConsultationsByDateRangeController)
  app.get('/record/:recordId', getRecordConsultationsController)
  app.get('/:id', getSingleConsultationController)
  app.put('/:id', updateConsultationController)
  app.delete('/:id', deleteConsultationController)
}
