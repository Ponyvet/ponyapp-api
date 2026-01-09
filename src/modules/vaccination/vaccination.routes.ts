import type { FastifyInstance } from 'fastify'

import {
  createVaccinationItemController,
  getPetVaccinationController,
  getVaccinationsByDateRangeController,
} from './vaccination.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createVaccinationItemController)
  app.get('/', getVaccinationsByDateRangeController)
  app.get('/:petId', getPetVaccinationController)
}
