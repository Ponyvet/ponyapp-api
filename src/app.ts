import Fastify from 'fastify'
import prismaPlugin from './plugins/prisma'
import clientRoutes from './modules/clients/client.routes'
/*import authRoutes from './modules/auth/auth.routes'
import clientRoutes from './modules/clients/client.routes' */

export const buildApp = () => {
  const app = Fastify({ logger: true })

  app.register(prismaPlugin)

  app.register(clientRoutes, { prefix: '/clients' })
  /*app.register(authRoutes, { prefix: '/auth' })
  app.register(clientRoutes, { prefix: '/clients' }) */

  return app
}
