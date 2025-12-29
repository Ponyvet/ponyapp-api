import type { FastifyInstance } from 'fastify'

import {
  createClientController,
  getClientsController,
} from './client.controller'

export default async function (app: FastifyInstance) {
  app.post('/', createClientController)
  app.get('/', getClientsController)
}
