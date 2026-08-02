import type { FastifyInstance } from 'fastify'

import {
  createClientController,
  getClientsController,
  getSingleClientController,
  updateClientController,
  deleteClientController,
} from './client.controller.js'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createClientController)
  app.get('/', getClientsController)
  app.get('/:id', getSingleClientController)
  app.put('/:id', updateClientController)
  app.delete('/:id', deleteClientController)
}
