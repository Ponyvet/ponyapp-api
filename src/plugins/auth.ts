import fp from 'fastify-plugin'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default fp((app: FastifyInstance) => {
  app.decorate(
    'authenticate',
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify()
      } catch {
        reply.status(401).send({ message: 'Unauthorized' })
      }
    }
  )
})
