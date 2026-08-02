import Fastify from 'fastify'
import cors from '@fastify/cors'
import { fromNodeHeaders } from 'better-auth/node'

import { auth } from './lib/auth.js'
import prismaPlugin from './plugins/prisma.js'
import bootstrapAdminPlugin from './plugins/bootstrap-admin.js'
import authPlugin from './plugins/auth.js'
import authorizationPlugin from './plugins/authorization.js'

import clientRoutes from './modules/clients/client.routes.js'
import usersRoutes from './modules/users/users.routes.js'
import medicalRecordsRoutes from './modules/medical-records/medical-records.routes.js'
import consultationsRoutes from './modules/consultations/consultations.routes.js'
import medicationsRoutes from './modules/medications/medications.routes.js'
import inventoryRoutes from './modules/inventory/inventory.routes.js'
import vaccinationRoutes from './modules/vaccination/vaccination.routes.js'
import petsRoutes from './modules/pets/pets.routes.js'
import visitsRoutes from './modules/visits/visits.routes.js'

export const buildApp = () => {
  const app = Fastify({ logger: true })

  app.register(cors, {
    origin: ['http://localhost:5173', 'https://app.ponyvet.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })

  app.register(prismaPlugin)
  app.register(bootstrapAdminPlugin)
  app.register(authPlugin)
  app.register(authorizationPlugin)

  app.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`)

      const req = new Request(url.toString(), {
        method: request.method,
        headers: fromNodeHeaders(request.headers),
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      })

      const response = await auth.handler(req)

      reply.status(response.status)
      response.headers.forEach((value, key) => reply.header(key, value))
      return reply.send(response.body ? await response.text() : null)
    },
  })

  app.register(clientRoutes, { prefix: '/clients' })
  app.register(usersRoutes, { prefix: '/users' })
  app.register(medicalRecordsRoutes, { prefix: '/medical-records' })
  app.register(consultationsRoutes, { prefix: '/consultations' })
  app.register(medicationsRoutes, { prefix: '/medications' })
  app.register(inventoryRoutes, { prefix: '/inventory' })
  app.register(vaccinationRoutes, { prefix: '/vaccinations' })
  app.register(petsRoutes, { prefix: '/pets' })
  app.register(visitsRoutes, { prefix: '/visits' })

  return app
}
