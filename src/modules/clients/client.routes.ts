import type { FastifyInstance } from 'fastify'

import {
  createClientController,
  getClientsController,
  getSingleClientController,
} from './client.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createClientController)
  app.get('/', getClientsController)
  app.get('/:id', getSingleClientController)
}
