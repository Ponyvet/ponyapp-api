import type { FastifyInstance } from 'fastify'

import {
  createConsultationController,
  getConsultationsController,
  getRecordConsultationsController,
  getSingleConsultationController,
  updateConsultationController,
  deleteConsultationController,
} from './consultations.controller.js'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createConsultationController)
  app.get('/', getConsultationsController)
  app.get('/record/:recordId', getRecordConsultationsController)
  app.get('/:id', getSingleConsultationController)
  app.put('/:id', updateConsultationController)
  app.delete('/:id', deleteConsultationController)
}
