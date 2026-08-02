import type { FastifyInstance } from 'fastify'

import {
  createInventoryItemController,
  getInventoryItemsController,
  getAllActiveInventoryItemsController,
  getLowStockItemsController,
  getExpiringSoonItemsController,
  getSingleInventoryItemController,
  updateInventoryItemController,
  adjustInventoryQuantityController,
  deleteInventoryItemController,
  getInventoryStatsController,
} from './inventory.controller.js'

export default function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', createInventoryItemController)
  app.get('/', getInventoryItemsController)
  app.get('/active', getAllActiveInventoryItemsController)
  app.get('/low-stock', getLowStockItemsController)
  app.get('/expiring-soon', getExpiringSoonItemsController)
  app.get('/stats', getInventoryStatsController)
  app.get('/:id', getSingleInventoryItemController)
  app.put('/:id', updateInventoryItemController)
  app.patch('/:id/adjust', adjustInventoryQuantityController)
  app.delete('/:id', deleteInventoryItemController)
}
