import type { FastifyReply } from 'fastify'
import type { PrismaClient } from '../generated/prisma/client.js'
import type { auth } from '../lib/auth.js'

type Session = Awaited<ReturnType<typeof auth.api.getSession>>

declare module 'fastify' {
  interface FastifyRequest {
    session?: NonNullable<Session>
  }

  interface FastifyInstance {
    prisma: PrismaClient
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
    authorize: (
      allowedRoles: string[],
    ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>
    authorizeClient: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}
