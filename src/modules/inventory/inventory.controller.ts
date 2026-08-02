import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  createInventoryItemSchema,
  updateInventoryItemSchema,
  adjustInventorySchema,
  inventoryItemIdParamSchema,
  inventoryQuerySchema,
} from './inventory.schema.js'
import {
  createInventoryItem,
  getInventoryItems,
  getAllActiveInventoryItems,
  getLowStockItems,
  getExpiringSoonItems,
  getSingleInventoryItem,
  updateInventoryItem,
  adjustInventoryQuantity,
  deleteInventoryItem,
  getInventoryStats,
} from './inventory.service.js'

export const createInventoryItemController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = createInventoryItemSchema.parse(req.body)
  const inventoryItem = await createInventoryItem(req.server.prisma, data)
  reply.code(201).send(inventoryItem)
}

export const getInventoryItemsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = inventoryQuerySchema.parse(req.query)
  const result = await getInventoryItems(req.server.prisma, query)
  reply.send(result)
}

export const getAllActiveInventoryItemsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const inventoryItems = await getAllActiveInventoryItems(req.server.prisma)
  reply.send(inventoryItems)
}

export const getLowStockItemsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { threshold } = req.query as { threshold?: string }
  const thresholdNum = threshold ? parseInt(threshold) : 10
  const inventoryItems = await getLowStockItems(req.server.prisma, thresholdNum)
  reply.send(inventoryItems)
}

export const getExpiringSoonItemsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { days } = req.query as { days?: string }
  const daysNum = days ? parseInt(days) : 30
  const inventoryItems = await getExpiringSoonItems(req.server.prisma, daysNum)
  reply.send(inventoryItems)
}

export const getSingleInventoryItemController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: itemId } = inventoryItemIdParamSchema.parse(req.params)
  const inventoryItem = await getSingleInventoryItem(req.server.prisma, itemId)

  if (!inventoryItem) {
    return reply.code(404).send({ message: 'Inventory item not found' })
  }

  reply.send(inventoryItem)
}

export const updateInventoryItemController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: itemId } = inventoryItemIdParamSchema.parse(req.params)
  const data = updateInventoryItemSchema.parse(req.body)
  const inventoryItem = await updateInventoryItem(
    req.server.prisma,
    itemId,
    data,
  )

  if (!inventoryItem) {
    return reply.code(404).send({ message: 'Inventory item not found' })
  }

  reply.send(inventoryItem)
}

export const adjustInventoryQuantityController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id: itemId } = inventoryItemIdParamSchema.parse(req.params)
    const adjustment = adjustInventorySchema.parse(req.body)
    const inventoryItem = await adjustInventoryQuantity(
      req.server.prisma,
      itemId,
      adjustment,
    )

    if (!inventoryItem) {
      return reply.code(404).send({ message: 'Inventory item not found' })
    }

    reply.send(inventoryItem)
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Cannot have negative inventory quantity'
    ) {
      return reply.code(400).send({ message: error.message })
    }
    throw error
  }
}

export const deleteInventoryItemController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id: itemId } = inventoryItemIdParamSchema.parse(req.params)
  const inventoryItem = await deleteInventoryItem(req.server.prisma, itemId)

  if (!inventoryItem) {
    return reply.code(404).send({ message: 'Inventory item not found' })
  }

  reply.code(204).send()
}

export const getInventoryStatsController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const stats = await getInventoryStats(req.server.prisma)
  reply.send(stats)
}
