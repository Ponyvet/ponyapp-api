import fp from 'fastify-plugin'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { SessionData } from '../modules/auth/auth.schema'

declare module 'fastify' {
  interface FastifyInstance {
    authorize: (
      allowedRoles: string[],
    ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>
    authorizeClient: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

export default fp((app: FastifyInstance) => {
  // Middleware para verificar roles
  app.decorate(
    'authorize',
    (allowedRoles: string[]) =>
      async (req: FastifyRequest, reply: FastifyReply) => {
        try {
          await req.jwtVerify()
          const session = req.user as SessionData

          if (!allowedRoles.includes(session.role)) {
            return reply.status(403).send({ message: 'Acceso denegado' })
          }
        } catch {
          reply.status(401).send({ message: 'Unauthorized' })
        }
      },
  )

  // Middleware específico para clientes - solo pueden acceder a sus propios datos
  app.decorate(
    'authorizeClient',
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify()
        const session = req.user as SessionData

        if (session.role === 'CLIENT') {
          // Los clientes solo pueden acceder a sus propios datos
          const clientId = req.params as Record<string, unknown>
          const queryClientId = req.query as Record<string, unknown>

          if (clientId?.clientId && clientId.clientId !== session.clientId) {
            return reply
              .status(403)
              .send({ message: 'Acceso denegado a datos de otro cliente' })
          }

          if (
            queryClientId?.clientId &&
            queryClientId.clientId !== session.clientId
          ) {
            return reply
              .status(403)
              .send({ message: 'Acceso denegado a datos de otro cliente' })
          }

          // Para otras rutas, inyectar el clientId automáticamente
          if (session.clientId) {
            if (req.method === 'GET' && req.query) {
              ;(req.query as Record<string, unknown>).clientId =
                session.clientId
            }
          }
        }
        // ADMIN y VETERINARIAN pueden acceder a todo
      } catch {
        reply.status(401).send({ message: 'Unauthorized' })
      }
    },
  )
})
