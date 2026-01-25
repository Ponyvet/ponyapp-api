import type { FastifyInstance } from 'fastify'

import {
  createVaccinationItemController,
  getPetVaccinationController,
  getVaccinationsByDateRangeController,
  updateVaccinationController,
  deleteVaccinationController,
} from './vaccination.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createVaccinationItemController)
  app.get('/', getVaccinationsByDateRangeController)
  app.get('/:petId', getPetVaccinationController)
  app.put('/:id', updateVaccinationController)
  app.delete('/:id', deleteVaccinationController)
}
