import type { FastifyInstance } from 'fastify'
import { getUserListController, createUserController } from './users.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)
  app.get('/list', getUserListController)
  app.post('/register', createUserController)
}
