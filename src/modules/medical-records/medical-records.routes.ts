import type { FastifyInstance } from 'fastify'

import {
  createMedicalRecordController,
  getMedicalRecordsController,
  getClientMedicalRecordsController,
  getSingleMedicalRecordController,
  updateMedicalRecordController,
  deleteMedicalRecordController,
} from './medical-records.controller.js'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createMedicalRecordController)
  app.get('/', getMedicalRecordsController)
  app.get('/client/:clientId', getClientMedicalRecordsController)
  app.get('/:id', getSingleMedicalRecordController)
  app.put('/:id', updateMedicalRecordController)
  app.delete('/:id', deleteMedicalRecordController)
}
