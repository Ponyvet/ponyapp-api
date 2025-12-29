import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../generated/prisma/client'

const prismaPlugin: FastifyPluginAsync = fp(async (server, _options) => {
  const connectionString = `${process.env.DATABASE_URL}`
  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })

  await prisma.$connect()

  server.decorate('prisma', prisma)

  server.addHook('onClose', async (server) => {
    await server.prisma.$disconnect()
  })
})

export default prismaPlugin
