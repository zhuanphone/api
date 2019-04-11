import { ensureUser } from '../../middleware/validators'
import * as goods from './controller'

export const baseUrl = '/goods'

export default [
  {
    method: 'POST',
    route: '/create',
    handlers: [
      ensureUser,
      goods.createGood
    ]
  },
  {
    method: 'GET',
    route: '/list',
    handlers: [
      goods.listGoods
    ]
  },
  {
    method: 'GET',
    route: '/read/:id',
    handlers: [
      goods.readGood
    ]
  },
  {
    method: 'POST',
    route: '/update/:id',
    handlers: [
      ensureUser,
      goods.updateGood
    ]
  },
  {
    method: 'DELETE',
    route: '/delete/:id',
    handlers: [
      ensureUser,
      goods.deleteGood
    ]
  },
  {
    method: 'POST',
    route: '/delete/multi',
    handlers: [
      ensureUser,
      goods.deleteMultiGoods
    ]
  },
]
