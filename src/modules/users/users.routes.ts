import type { FastifyInstance } from 'fastify'
import {
  getUserListController,
  getSingleUserController,
  createUserController,
  updateUserController,
  deleteUserController,
} from './users.controller.js'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.get('/list', getUserListController)
  app.get('/:id', getSingleUserController)
  app.post('/register', createUserController)
  app.put('/:id', updateUserController)
  app.delete('/:id', deleteUserController)
}
