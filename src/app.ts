import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import prismaPlugin from './plugins/prisma'
import authPlugin from './plugins/auth'
import authorizationPlugin from './plugins/authorization'

import clientRoutes from './modules/clients/client.routes'
import authRoutes from './modules/auth/auth.routes'
import usersRoutes from './modules/users/users.routes'
import medicalRecordsRoutes from './modules/medical-records/medical-records.routes'
import consultationsRoutes from './modules/consultations/consultations.routes'
import medicationsRoutes from './modules/medications/medications.routes'
import inventoryRoutes from './modules/inventory/inventory.routes'
import vaccinationRoutes from './modules/vaccination/vaccination.routes'
import petsRoutes from './modules/pets/pets.routes'

export const buildApp = () => {
  const app = Fastify({ logger: true })

  app.register(cors, {
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })

  app.register(prismaPlugin)
  app.register(authPlugin)
  app.register(authorizationPlugin)
  app.register(cookie)
  app.register(jwt, {
    secret: process.env.JWT_SECRET!,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  })

  app.register(authRoutes, { prefix: '/auth' })
  app.register(clientRoutes, { prefix: '/clients' })
  app.register(usersRoutes, { prefix: '/users' })
  app.register(medicalRecordsRoutes, { prefix: '/medical-records' })
  app.register(consultationsRoutes, { prefix: '/consultations' })
  app.register(medicationsRoutes, { prefix: '/medications' })
  app.register(inventoryRoutes, { prefix: '/inventory' })
  app.register(vaccinationRoutes, { prefix: '/vaccinations' })
  app.register(petsRoutes, { prefix: '/pets' })

  return app
}
