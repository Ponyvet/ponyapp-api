import type { FastifyInstance } from 'fastify'

import {
  createVaccinationItemController,
  getPetVaccinationController,
} from './vaccination.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createVaccinationItemController)
  app.get('/:petId', getPetVaccinationController)
}
