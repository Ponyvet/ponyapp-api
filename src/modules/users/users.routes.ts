import type { FastifyInstance } from 'fastify'
import { getUserListController } from './users.controller'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.get('/list', getUserListController)
}
