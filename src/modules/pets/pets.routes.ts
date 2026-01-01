import type { FastifyInstance } from 'fastify'

import {
  createPetController,
  getClientPetsController,
  getSinglePetController,
} from './pets.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createPetController)
  app.get('/client/:clientId', getClientPetsController)
  app.get('/:petId', getSinglePetController)
}
