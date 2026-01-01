import type { FastifyInstance } from 'fastify'

import type { CreatePetDto } from './pets.schema'
import type { Prisma } from '../../generated/prisma/browser'

export const createPet = (
  prisma: FastifyInstance['prisma'],
  data: CreatePetDto
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
  clientId: CreatePetDto['clientId']
) => {
  return prisma.pet.findMany({
    where: { clientId },
  })
}

export const getSinglePet = (
  prisma: FastifyInstance['prisma'],
  petId: Prisma.PetWhereUniqueInput
) => {
  return prisma.pet.findUnique({
    where: petId,
  })
}
