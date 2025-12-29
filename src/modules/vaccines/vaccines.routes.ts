import type { FastifyInstance } from 'fastify'

import {
  getVaccinesController,
  createVaccineController,
} from './vaccines.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createVaccineController)
  app.get('/', getVaccinesController)
}
