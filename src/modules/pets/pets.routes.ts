import type { FastifyInstance } from 'fastify'

import {
  createPetController,
  getAllPetsController,
  getSinglePetController,
  updatePetController,
  deletePetController,
} from './pets.controller.js'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createPetController)
  app.get('/', getAllPetsController)
  app.get('/:petId', getSinglePetController)
  app.put('/:petId', updatePetController)
  app.delete('/:petId', deletePetController)
}
