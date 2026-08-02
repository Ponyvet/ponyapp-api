import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'

import { prisma } from '../lib/prisma.js'

const prismaPlugin: FastifyPluginAsync = fp(async (server, _options) => {
  await prisma.$connect()

  server.decorate('prisma', prisma)

  server.addHook('onClose', async (server) => {
    await server.prisma.$disconnect()
  })
})

export default prismaPlugin
