import type { FastifyInstance } from 'fastify'

import {
  createMedicationController,
  getMedicationsController,
  getAllActiveMedicationsController,
  getMedicationsByCategoryController,
  getSingleMedicationController,
  updateMedicationController,
  deleteMedicationController,
} from './medications.controller.js'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createMedicationController)
  app.get('/', getMedicationsController)
  app.get('/active', getAllActiveMedicationsController)
  app.get('/category/:category', getMedicationsByCategoryController)
  app.get('/:id', getSingleMedicationController)
  app.put('/:id', updateMedicationController)
  app.delete('/:id', deleteMedicationController)
}
