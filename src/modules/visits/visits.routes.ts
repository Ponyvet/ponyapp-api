import type { FastifyInstance } from 'fastify'

import {
  createVisitController,
  getVisitsController,
  getClientVisitsController,
  getVisitsByDateRangeController,
  getSingleVisitController,
  updateVisitController,
  deleteVisitController,
} from './visits.controller.js'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createVisitController)
  app.get('/', getVisitsController)
  app.get('/date-range', getVisitsByDateRangeController)
  app.get('/client/:clientId', getClientVisitsController)
  app.get('/:id', getSingleVisitController)
  app.put('/:id', updateVisitController)
  app.delete('/:id', deleteVisitController)
}
