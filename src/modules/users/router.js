import { ensureUser } from '../../middleware/validators'
import * as user from './controller'

export const baseUrl = '/users'

export default [
  {
    method: 'POST',
    route: '/create',
    handlers: [
      user.createUser
    ]
  },
  {
    method: 'GET',
    route: '/list',
    handlers: [
      user.getUsers
    ]
  },
  {
    method: 'GET',
    route: '/read/:id',
    handlers: [
      user.getUser
    ]
  },
  {
    method: 'POST',
    route: '/update/:id',
    handlers: [
      ensureUser,
      user.getUser,
      user.updateUser
    ]
  },
  {
    method: 'DELETE',
    route: '/delete/:id',
    handlers: [
      ensureUser,
      user.getUser,
      user.deleteUser
    ]
  },

  // 对用户购物车的操作
  {
    method: 'GET',
    route: '/cart/list',
    handlers: [
      ensureUser,
      user.getUserCart
    ]
  },

  {
    method: 'POST',
    route: '/cart/add',
    handlers: [
      ensureUser,
      user.addToCart
    ]
  },
  {
    method: 'POST',
    route: '/cart/remove',
    handlers: [
      ensureUser,
      user.removeFromCart
    ]
  }
]
