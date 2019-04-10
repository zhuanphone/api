import { ensureUser } from '../../middleware/validators'
import * as commodities from './controller'

export const baseUrl = '/commodities'

export default [
  {
    method: 'POST',
    route: '/create',
    handlers: [
      ensureUser,
      commodities.createCommodity
    ]
  },
  {
    method: 'GET',
    route: '/list',
    handlers: [
      commodities.listCommodities
    ]
  },
  {
    method: 'GET',
    route: '/read/:id',
    handlers: [
      commodities.readCommodity
    ]
  },
  {
    method: 'POST',
    route: '/update/:id',
    handlers: [
      ensureUser,
      commodities.updateCommodity
    ]
  },
  {
    method: 'DELETE',
    route: '/delete/:id',
    handlers: [
      ensureUser,
      commodities.deleteCommodity
    ]
  },
  {
    method: 'POST',
    route: '/delete/multi',
    handlers: [
      ensureUser,
      commodities.deleteMultiCommodities
    ]
  },
]
