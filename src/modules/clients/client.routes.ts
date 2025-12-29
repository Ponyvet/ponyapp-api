import type { FastifyInstance } from 'fastify'

import {
  createClientController,
  getClientsController,
} from './client.controller'

export default async function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createClientController)
  app.get('/', getClientsController)
}
