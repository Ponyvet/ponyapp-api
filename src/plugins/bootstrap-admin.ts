import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'

import { UserRole } from '../generated/prisma/client.js'
import { auth } from '../lib/auth.js'

const bootstrapAdminPlugin: FastifyPluginAsync = fp(async (server) => {
  const existingAdmin = await server.prisma.user.findFirst({
    where: { role: UserRole.ADMIN },
  })

  if (existingAdmin) {
    return
  }

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME

  if (!email || !password || !name) {
    server.log.warn(
      'SEED_ADMIN_EMAIL, SEED_ADMIN_NAME o SEED_ADMIN_PASSWORD no definidas: se omite la creación del admin inicial',
    )
    return
  }

  await auth.api.createUser({
    body: {
      email,
      password,
      name,
      role: UserRole.ADMIN,
    },
  })

  server.log.info(`Usuario admin inicial creado: ${email}`)
})

export default bootstrapAdminPlugin
