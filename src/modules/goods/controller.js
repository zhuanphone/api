import Good from '../../models/good'
import Order from '../../models/order'
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
      .lean()

    goods.forEach(good => {
      if (good.properties && good.properties !== '') {
        good.properties = JSON.parse(good.properties)
      }
    })

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

  const goodInfo = ctx.request.body
  const { properties, ...meta } = goodInfo

  const good = new Good({ ...meta, properties: JSON.stringify(properties) })

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
    const goodId = ctx.params.id
    const result = await Good
      .findById(goodId).lean()

    if (result.properties && result.properties !== '') {
      result.properties = JSON.parse(result.properties)
    }

    // 找到所有订单中该商品
    const releatedOrders = await Order.find({ "goods.id": goodId }).lean()

    let total = 0
    releatedOrders.forEach(order => {
      const count = order.goods.filter(item => item.good === goodId).reduce(function (ret, cur) {
        return ret + cur.count
      }, 0)
      total += count
    })

    result.saleCount = total

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


