import { ensureUser } from '../../middleware/validators'
import * as notices from './controller'

export const baseUrl = '/notices'

export default [
  {
    method: 'POST',
    route: '/create',
    handlers: [
      ensureUser,
      notices.createNotice
    ]
  },
  {
    method: 'GET',
    route: '/list',
    handlers: [
      notices.getNotices
    ]
  },
  {
    method: 'GET',
    route: '/read/:id',
    handlers: [
      notices.getNotice
    ]
  },
  {
    method: 'POST',
    route: '/update/:id',
    handlers: [
      ensureUser,
      notices.updateNotice
    ]
  },
  {
    method: 'DELETE',
    route: '/delete/:id',
    handlers: [
      ensureUser,
      notices.deleteNotice
    ]
  }
]
