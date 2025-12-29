import type { FastifyInstance } from 'fastify'

import { loginController, logoutController } from './auth.controller'

export default function (app: FastifyInstance) {
  app.post('/login', loginController)
  app.post('/logout', { preHandler: [app.authenticate] }, logoutController)
}
