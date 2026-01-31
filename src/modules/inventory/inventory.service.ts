import type { FastifyInstance } from 'fastify'
import type {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  AdjustInventoryDto,
  InventoryQueryDto,
} from './inventory.schema'

export const createInventoryItem = (
  prisma: FastifyInstance['prisma'],
  data: CreateInventoryItemDto,
) => {
  return prisma.inventoryItem.create({
    data: {
      ...data,
      ...(data.expirationDate && {
        expirationDate: data.expirationDate,
      }),
    },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  })
}

export const getInventoryItems = async (
  prisma: FastifyInstance['prisma'],
  query: InventoryQueryDto,
) => {
  const {
    page,
    limit,
    category,
    medicationId,
    lowStock,
    expiringSoon,
    search,
  } = query
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {
    isActive: true,
    ...(category && { category }),
    ...(medicationId && { medicationId }),
    ...(lowStock && { quantity: { lt: lowStock } }),
    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive' as const,
      },
    }),
  }

  // Filtro para items que expiran pronto
  if (expiringSoon) {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + expiringSoon)

    where.expirationDate = {
      lte: expirationDate,
      gte: new Date(), // No incluir items ya expirados
    }
  }

  const [inventoryItems, total] = await Promise.all([
    prisma.inventoryItem.findMany({
      where,
      skip,
      take: limit,
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: [
        { quantity: 'asc' }, // Items con menor stock primero
        { expirationDate: 'asc' }, // Items que expiran antes primero
        { name: 'asc' },
      ],
    }),
    prisma.inventoryItem.count({ where }),
  ])

  return {
    data: inventoryItems,
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

export const getAllActiveInventoryItems = (
  prisma: FastifyInstance['prisma'],
) => {
  return prisma.inventoryItem.findMany({
    where: { isActive: true },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export const getLowStockItems = (
  prisma: FastifyInstance['prisma'],
  threshold: number = 10,
) => {
  return prisma.inventoryItem.findMany({
    where: {
      isActive: true,
      quantity: { lt: threshold },
    },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
    orderBy: { quantity: 'asc' },
  })
}

export const getExpiringSoonItems = (
  prisma: FastifyInstance['prisma'],
  days: number = 30,
) => {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + days)

  return prisma.inventoryItem.findMany({
    where: {
      isActive: true,
      expirationDate: {
        lte: expirationDate,
        gte: new Date(),
      },
    },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
    orderBy: { expirationDate: 'asc' },
  })
}

export const getSingleInventoryItem = (
  prisma: FastifyInstance['prisma'],
  itemId: string,
) => {
  return prisma.inventoryItem.findFirst({
    where: {
      id: itemId,
      isActive: true,
    },
    include: {
      medication: true,
    },
  })
}

export const updateInventoryItem = async (
  prisma: FastifyInstance['prisma'],
  itemId: string,
  data: UpdateInventoryItemDto,
) => {
  const existingItem = await prisma.inventoryItem.findFirst({
    where: { id: itemId, isActive: true },
  })

  if (!existingItem) {
    return null
  }

  return prisma.inventoryItem.update({
    where: { id: itemId },
    data: {
      ...data,
      ...(data.expirationDate && {
        expirationDate: data.expirationDate,
      }),
    },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  })
}

export const adjustInventoryQuantity = async (
  prisma: FastifyInstance['prisma'],
  itemId: string,
  adjustment: AdjustInventoryDto,
) => {
  const existingItem = await prisma.inventoryItem.findFirst({
    where: { id: itemId, isActive: true },
  })

  if (!existingItem) {
    return null
  }

  const newQuantity = existingItem.quantity + adjustment.quantity

  if (newQuantity < 0) {
    throw new Error('Cannot have negative inventory quantity')
  }

  return prisma.inventoryItem.update({
    where: { id: itemId },
    data: { quantity: newQuantity },
    include: {
      medication: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  })
}

export const deleteInventoryItem = async (
  prisma: FastifyInstance['prisma'],
  itemId: string,
) => {
  const existingItem = await prisma.inventoryItem.findFirst({
    where: { id: itemId, isActive: true },
  })

  if (!existingItem) {
    return null
  }

  return prisma.inventoryItem.update({
    where: { id: itemId },
    data: { isActive: false },
  })
}

export const getInventoryStats = async (prisma: FastifyInstance['prisma']) => {
  const [
    totalItems,
    lowStockCount,
    expiringSoonCount,
    totalValue,
    categoryStats,
  ] = await Promise.all([
    prisma.inventoryItem.count({ where: { isActive: true } }),
    prisma.inventoryItem.count({
      where: { isActive: true, quantity: { lt: 10 } },
    }),
    prisma.inventoryItem.count({
      where: {
        isActive: true,
        expirationDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          gte: new Date(),
        },
      },
    }),
    prisma.inventoryItem.aggregate({
      where: { isActive: true },
      _sum: { quantity: true },
    }),
    prisma.inventoryItem.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true },
      _sum: { quantity: true },
    }),
  ])

  return {
    totalItems,
    lowStockCount,
    expiringSoonCount,
    totalQuantity: totalValue._sum.quantity || 0,
    categoryStats,
  }
}
