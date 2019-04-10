import Commodity from '../../models/commodity'
import { qiniuUrl } from '../../utils/const';

export async function listCommodities(ctx) {
  let { page, limit, keyword, sort } = ctx.request.query
  page = Number(page) || 1
  limit = Number(limit) || 10
  sort = sort || '-created'

  let query = {}
  if (keyword) query['name'] = { $regex: keyword }

  try {
    const total = await Commodity.count({})
    const commodities = await Commodity
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)

    ctx.body = {
      status: 200,
      result: { pagination: { total, limit }, list: commodities }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}

export async function createCommodity(ctx) {
  const commodity = new Commodity(ctx.request.body)

  try {
    await commodity.save()
    const response = commodity.toJSON()

    ctx.body = {
      status: 201,
      message: 'Create Commodity Success',
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

export async function readCommodity(ctx, next) {
  try {
    const result = await Commodity
      .findById(ctx.params.id)

    if (!result) {
      ctx.status = 404
      ctx.body = {
        status: 404,
        message: "Commodity Not Found!"
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

export async function updateCommodity(ctx) {
  const { id } = ctx.params
  console.log('update id: ', id)
  const updated = ctx.request.body

  try {
    await Commodity.update({ _id: id }, updated)
    ctx.status = 201
    ctx.body = {
      status: 201,
      message: 'Update Commodity Success!'
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}

export async function deleteCommodity(ctx) {
  const { id } = ctx.params
  try {
    await Commodity.remove({ _id: id })
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
export async function deleteMultiCommodities(ctx) {
  const { ids } = ctx.request.body
  try {
    await Commodity.remove({ _id: { $in: ids } })
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


