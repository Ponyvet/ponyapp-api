import type { FastifyInstance } from 'fastify'

import { createPetController, getClientPetsController } from './pets.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createPetController)
  app.get('/client/:clientId', getClientPetsController)
}
