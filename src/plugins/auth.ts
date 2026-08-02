import fp from 'fastify-plugin'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { fromNodeHeaders } from 'better-auth/node'

import { auth } from '../lib/auth.js'

export default fp((app: FastifyInstance) => {
  app.decorate(
    'authenticate',
    async (req: FastifyRequest, reply: FastifyReply) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      })

      if (!session || !session.user.isActive) {
        return reply.status(401).send({ message: 'Unauthorized' })
      }

      req.session = session
    },
  )
})
