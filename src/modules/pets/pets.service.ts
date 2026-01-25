import type { FastifyInstance } from 'fastify'

import type { CreatePetDto, UpdatePetDto, PetsQueryDto } from './pets.schema'
import type { Prisma } from '../../generated/prisma/browser'

export const createPet = (
  prisma: FastifyInstance['prisma'],
  data: CreatePetDto,
) => {
  return prisma.pet.create({
    data: {
      name: data.name,
      species: data.species,
      breed: data.breed,
      sex: data.sex,
      birthDate: data.birthDate,
      color: data.color,
      notes: data.notes,
      client: { connect: { id: data.clientId } },
    },
  })
}

export const getClientPets = (
  prisma: FastifyInstance['prisma'],
  clientId: CreatePetDto['clientId'],
) => {
  return prisma.pet.findMany({
    where: {
      clientId,
      isActive: true,
    },
  })
}

export const getAllPets = async (
  prisma: FastifyInstance['prisma'],
  query: PetsQueryDto,
) => {
  const { page, limit, sortBy, sortOrder, ...filters } = query

  const where: Prisma.PetWhereInput = {
    isActive: true,
    ...(filters.name && {
      name: {
        contains: filters.name,
        mode: 'insensitive' as Prisma.QueryMode,
      },
    }),
    ...(filters.species && { species: filters.species }),
    ...(filters.sex && { sex: filters.sex }),
    ...(filters.breed && {
      breed: {
        contains: filters.breed,
        mode: 'insensitive' as Prisma.QueryMode,
      },
    }),
    ...(filters.clientId && { clientId: filters.clientId }),
  }

  const skip = (page - 1) * limit

  const [pets, total] = await Promise.all([
    prisma.pet.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.pet.count({ where }),
  ])

  return {
    data: pets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}

export const getSinglePet = (
  prisma: FastifyInstance['prisma'],
  petId: Prisma.PetWhereUniqueInput,
) => {
  return prisma.pet.findFirst({
    where: {
      ...petId,
      isActive: true,
    },
  })
}

export const updatePet = async (
  prisma: FastifyInstance['prisma'],
  petId: string,
  data: UpdatePetDto,
) => {
  const existingPet = await prisma.pet.findFirst({
    where: { id: petId, isActive: true },
  })

  if (!existingPet) {
    return null
  }

  return prisma.pet.update({
    where: { id: petId },
    data,
  })
}

export const deletePet = async (
  prisma: FastifyInstance['prisma'],
  petId: string,
) => {
  const existingPet = await prisma.pet.findFirst({
    where: { id: petId, isActive: true },
  })

  if (!existingPet) {
    return null
  }

  return prisma.pet.update({
    where: { id: petId },
    data: { isActive: false },
  })
}
