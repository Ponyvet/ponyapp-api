import fp from 'fastify-plugin'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default fp((app: FastifyInstance) => {
  // Middleware para verificar roles
  app.decorate(
    'authorize',
    (allowedRoles: string[]) =>
      async (req: FastifyRequest, reply: FastifyReply) => {
        await app.authenticate(req, reply)
        if (reply.sent) return

        const { session } = req

        if (!session || !allowedRoles.includes(session.user.role ?? '')) {
          return reply.status(403).send({ message: 'Acceso denegado' })
        }
      },
  )

  // Middleware específico para clientes - solo pueden acceder a sus propios datos
  app.decorate(
    'authorizeClient',
    async (req: FastifyRequest, reply: FastifyReply) => {
      await app.authenticate(req, reply)
      if (reply.sent) return

      const { session } = req

      if (!session) {
        return reply.status(401).send({ message: 'Unauthorized' })
      }

      if (session.user.role === 'CLIENT') {
        // Los clientes solo pueden acceder a sus propios datos
        const clientId = req.params as Record<string, unknown>
        const queryClientId = req.query as Record<string, unknown>

        if (clientId?.clientId && clientId.clientId !== session.user.clientId) {
          return reply
            .status(403)
            .send({ message: 'Acceso denegado a datos de otro cliente' })
        }

        if (
          queryClientId?.clientId &&
          queryClientId.clientId !== session.user.clientId
        ) {
          return reply
            .status(403)
            .send({ message: 'Acceso denegado a datos de otro cliente' })
        }

        // Para otras rutas, inyectar el clientId automáticamente
        if (session.user.clientId) {
          if (req.method === 'GET' && req.query) {
            ;(req.query as Record<string, unknown>).clientId =
              session.user.clientId
          }
        }
      }
      // ADMIN y VETERINARIAN pueden acceder a todo
    },
  )
})
