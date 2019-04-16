import * as auth from './controller'
import * as users from '../users/controller'

export const baseUrl = '/auth'

export default [
  {
    method: 'POST',
    route: '/login',
    handlers: [
      auth.login
    ]
  },
  {
    method: 'POST',
    route: '/register',
    handlers: [
      auth.register
    ]
  },
  {
    method: 'GET',
    route: '/qiniu/token',
    handlers: [
      auth.createQiniuToken
    ]
  }
]
