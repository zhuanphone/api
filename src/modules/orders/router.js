import { ensureUser } from '../../middleware/validators'
import * as orders from './controller'

export const baseUrl = '/orders'

export default [
  {
    method: 'POST',
    route: '/create',
    handlers: [
      ensureUser,
      orders.createOrder
    ]
  },
  {
    method: 'GET',
    route: '/list',
    handlers: [
      orders.getOrders
    ]
  },
  {
    method: 'GET',
    route: '/read/:id',
    handlers: [
      orders.readOrder
    ]
  },
  {
    method: 'POST',
    route: '/update/:id',
    handlers: [
      ensureUser,
      orders.updateOrder
    ]
  },
  {
    method: 'DELETE',
    route: '/delete/:id',
    handlers: [
      ensureUser,
      orders.deleteOrder
    ]
  }
]
