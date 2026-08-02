import type { FastifyInstance } from 'fastify'

import {
  createVaccinationController,
  getVaccinationsController,
  getRecordVaccinationsController,
  getVaccinationsByDateRangeController,
  getUpcomingVaccinationsController,
  getSingleVaccinationController,
  updateVaccinationController,
  deleteVaccinationController,
} from './vaccination.controller.js'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createVaccinationController)
  app.get('/', getVaccinationsController)
  app.get('/date-range', getVaccinationsByDateRangeController)
  app.get('/upcoming', getUpcomingVaccinationsController)
  app.get('/record/:recordId', getRecordVaccinationsController)
  app.get('/:id', getSingleVaccinationController)
  app.put('/:id', updateVaccinationController)
  app.delete('/:id', deleteVaccinationController)
}
