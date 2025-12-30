import type { FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcrypt'

import { loginSchema, sessionSchema } from './auth.schema'

export const loginController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { email, password } = loginSchema.parse(req.body)

  const user = await req.server.prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return reply.status(401).send({ message: 'Credenciales inválidas' })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return reply.status(401).send({ message: 'Credenciales inválidas' })
  }

  const token = req.server.jwt.sign({ id: user.id })

  reply
    .setCookie('token', token, {
      httpOnly: true,
      path: '/',
    })
    .send({ message: 'Inicio de sesión exitoso' })
}

export const logoutController = (_req: FastifyRequest, reply: FastifyReply) => {
  reply
    .clearCookie('token', {
      httpOnly: true,
      path: '/',
    })
    .send({ message: 'Cierre de sesión exitoso' })
}

export const profileController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id: userId } = sessionSchema.parse(req.user)

  const user = await req.server.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  reply.send(user)
}
