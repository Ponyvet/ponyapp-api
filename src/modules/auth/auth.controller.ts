import type { FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcrypt'

import { loginSchema, sessionSchema } from './auth.schema'

export const loginController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, password } = loginSchema.parse(req.body)

  const user = await req.server.prisma.user.findUnique({
    where: { email },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!user || !user.isActive) {
    return reply.status(401).send({ message: 'Credenciales inválidas' })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return reply.status(401).send({ message: 'Credenciales inválidas' })
  }

  const tokenPayload = {
    id: user.id,
    role: user.role,
    ...(user.clientId && { clientId: user.clientId }),
  }

  const token = req.server.jwt.sign(tokenPayload)

  reply
    .setCookie('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })
    .send({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        client: user.client,
      },
    })
}

export const logoutController = (_req: FastifyRequest, reply: FastifyReply) => {
  reply
    .clearCookie('token', {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })
    .send({ message: 'Cierre de sesión exitoso' })
}

export const profileController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: userId } = sessionSchema.parse(req.user)

  const user = await req.server.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
      },
    },
  })

  if (!user) {
    return reply.status(404).send({ message: 'Usuario no encontrado' })
  }

  reply.send(user)
}
