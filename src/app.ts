import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import prismaPlugin from './plugins/prisma'
import authPlugin from './plugins/auth'
import clientRoutes from './modules/clients/client.routes'
import authRoutes from './modules/auth/auth.routes'
import petsRoutes from './modules/pets/pets.routes'
import vaccinesRoutes from './modules/vaccines/vaccines.routes'
import vaccinationRoutes from './modules/vaccination/vaccination.routes'

export const buildApp = () => {
  const app = Fastify({ logger: true })

  app.register(cors, {
    origin: ['http://localhost:5173'],
    credentials: true,
  })
  app.register(prismaPlugin)
  app.register(authPlugin)
  app.register(cookie)
  app.register(jwt, {
    secret: process.env.JWT_SECRET!,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  })

  app.register(clientRoutes, {
    prefix: '/clients',
  })
  app.register(authRoutes, { prefix: '/auth' })
  app.register(petsRoutes, { prefix: '/pets' })
  app.register(vaccinesRoutes, { prefix: '/vaccines' })
  app.register(vaccinationRoutes, { prefix: '/vaccination' })

  return app
}
