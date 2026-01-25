import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import type { CreateUserDto } from './users.schema'

export const getUserList = (prisma: FastifyInstance['prisma']) => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    where: { isActive: true },
  })
}

export const createUser = async (
  prisma: FastifyInstance['prisma'],
  data: CreateUserDto,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error('Email already exists')
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })
}
