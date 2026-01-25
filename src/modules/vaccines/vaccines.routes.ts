import type { FastifyInstance } from 'fastify'

import {
  getVaccinesController,
  createVaccineController,
  updateVaccineController,
  deleteVaccineController,
} from './vaccines.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createVaccineController)
  app.get('/', getVaccinesController)
  app.put('/:id', updateVaccineController)
  app.delete('/:id', deleteVaccineController)
}
