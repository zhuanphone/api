import { ensureUser } from '../../middleware/validators'
import * as imgs from './controller'

export const baseUrl = '/imgs'

export default [
  {
    method: 'POST',
    route: '/create',
    handlers: [
      ensureUser,
      imgs.createImgs
    ]
  },
  {
    method: 'GET',
    route: '/list',
    handlers: [
      imgs.listImgs
    ]
  },
  {
    method: 'GET',
    route: '/read/:id',
    handlers: [
      imgs.readImg
    ]
  },
  {
    method: 'POST',
    route: '/update/:id',
    handlers: [
      ensureUser,
      imgs.readImg,
      imgs.updateImg
    ]
  },
  {
    method: 'POST',
    route: '/update/multi',
    handlers: [
      ensureUser,
      imgs.updateMultiImgs
    ]
  },
  {
    method: 'DELETE',
    route: '/delete/:id',
    handlers: [
      ensureUser,
      imgs.deleteImg
    ]
  },
  {
    method: 'POST',
    route: '/delete/multi',
    handlers: [
      ensureUser,
      imgs.deleteMultiImgs
    ]
  }
]
