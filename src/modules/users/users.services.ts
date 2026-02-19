import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import type { CreateUserDto, UpdateUserDto } from './users.schema'

export const getUserList = (prisma: FastifyInstance['prisma']) => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      clientId: true,
      isActive: true,
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
    },
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })
}

export const getSingleUser = (
  prisma: FastifyInstance['prisma'],
  userId: string,
) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      clientId: true,
      isActive: true,
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
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

  // Validar que si es un usuario CLIENT, tenga clientId
  if (data.role === 'CLIENT' && !data.clientId) {
    throw new Error('CLIENT users must have a clientId')
  }

  // Validar que el clientId exista si se proporciona
  if (data.clientId) {
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    })

    if (!client) {
      throw new Error('Client not found')
    }

    // Verificar que el cliente no tenga ya un usuario asociado
    const existingClientUser = await prisma.user.findFirst({
      where: { clientId: data.clientId },
    })

    if (existingClientUser) {
      throw new Error('Client already has a user account')
    }
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      clientId: data.clientId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      clientId: true,
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
      isActive: true,
    },
  })
}

export const updateUser = async (
  prisma: FastifyInstance['prisma'],
  userId: string,
  data: UpdateUserDto,
) => {
  const existingUser = await prisma.user.findFirst({
    where: { id: userId, isActive: true },
  })

  if (!existingUser) {
    return null
  }

  // Si se intenta cambiar el email, verificar que no exista
  if (data.email && data.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (emailExists) {
      throw new Error('Email already exists')
    }
  }

  // Validaciones de clientId
  if (data.clientId) {
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    })

    if (!client) {
      throw new Error('Client not found')
    }

    // Verificar que el cliente no tenga ya otro usuario asociado
    const existingClientUser = await prisma.user.findFirst({
      where: {
        clientId: data.clientId,
        id: { not: userId },
      },
    })

    if (existingClientUser) {
      throw new Error('Client already has a user account')
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      clientId: true,
      isActive: true,
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      updatedAt: true,
    },
  })
}

export const deleteUser = async (
  prisma: FastifyInstance['prisma'],
  userId: string,
) => {
  const existingUser = await prisma.user.findFirst({
    where: { id: userId, isActive: true },
  })

  if (!existingUser) {
    return null
  }

  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  })
}
