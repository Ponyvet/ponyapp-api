import type { FastifyInstance } from 'fastify'
import { getUserListController, createUserController } from './users.controller'

export default function (app: FastifyInstance) {
  // Endpoint público para registro de usuarios
  app.post('/register', createUserController)

  // Endpoints protegidos
  app.addHook('preHandler', app.authenticate)
  app.get('/list', getUserListController)
}
