import Good from '../../models/good'
import { qiniuUrl } from '../../utils/const';

export async function listGoods(ctx) {
  let { page, limit, keyword, sort } = ctx.request.query
  page = Number(page) || 1
  limit = Number(limit) || 10
  sort = sort || '-created'

  let query = {}
  if (keyword) query['name'] = { $regex: keyword }

  try {
    const total = await Good.count({})
    const goods = await Good
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)

    ctx.body = {
      status: 200,
      result: { pagination: { total, limit }, list: goods }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}

export async function createGood(ctx) {
  const good = new Good(ctx.request.body)

  try {
    await good.save()
    const response = good.toJSON()

    ctx.body = {
      status: 201,
      message: 'Create Good Success',
      result: response
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}

export async function readGood(ctx, next) {
  try {
    const result = await Good
      .findById(ctx.params.id)

    if (!result) {
      ctx.status = 404
      ctx.body = {
        status: 404,
        message: "Good Not Found!"
      }
    }

    ctx.body = {
      status: 200,
      result
    }
  } catch (err) {

    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }

  if (next) { return next() }
}

export async function updateGood(ctx) {
  const { id } = ctx.params
  const updated = ctx.request.body

  try {
    await Good.update({ _id: id }, updated)
    ctx.status = 201
    ctx.body = {
      status: 201,
      message: 'Update Good Success!'
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}

export async function deleteGood(ctx) {
  const { id } = ctx.params
  try {
    await Good.remove({ _id: id })
    ctx.body = {
      status: 200,
      message: 'Delete Success'
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}

/**
 * 
 * @param request.body {ids: [_id1, _id2]}
 */
export async function deleteMultiGoods(ctx) {
  const { ids } = ctx.request.body
  try {
    await Good.remove({ _id: { $in: ids } })
    ctx.body = {
      status: 200,
      message: 'Delete Success'
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}


