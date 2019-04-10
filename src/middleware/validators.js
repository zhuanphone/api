import User from '../models/users'
import config from '../../config'
import { getToken } from '../utils/auth'
import { verify } from 'jsonwebtoken'

export async function ensureUser(ctx, next) {
  const token = getToken(ctx)

  if (!token) {
    ctx.status = 401
    ctx.body = {
      status: 401,
      message: "Unauthorized: 无权限"
    }
    return
  }

  let decoded = null
  try {
    decoded = verify(token, config.token)
  } catch (err) {
    ctx.status = 403
    ctx.body = {
      status: 403,
      message: "Forbidden: Token过期"
    }
    return
  }

  try {
    ctx.state.user = await User.findById(decoded.id, '-password')
    if (!ctx.state.user) {
      ctx.status = 401
      ctx.body = {
        status: 401,
        message: "Token无效"
      }
      return
    }
    return next()
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}
