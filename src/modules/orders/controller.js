import Order from '../../models/order'


export async function getOrders(ctx) {
  let { page, limit, keyword, sort } = ctx.request.query
  page = Number(page) || 1
  limit = Number(limit) || 10
  sort = sort || '-created'

  let query = {}
  if (keyword) query['name'] = { $regex: keyword }

  try {
    const total = await Order.count({})
    const orders = await Order
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
    ctx.body = {
      status: 200,
      result: { pagination: { total, limit }, list: orders }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}

export async function createOrder(ctx) {
  const order = new Order(ctx.request.body)

  try {
    await order.save()
    const response = order.toJSON()

    ctx.status = 201
    ctx.body = {
      status: 201,
      result: response
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      result: error.message
    }
  }
}

export async function updateOrder(ctx) {
  const { id } = ctx.params
  const updated = ctx.request.body
  try {
    await Order.update({ _id: id }, updated)
    ctx.status = 201
    ctx.body = {
      status: 201,
      message: 'Update Order Success!'
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      result: error.message
    }
  }
}

export async function readOrder(ctx) {
  const { id } = ctx.params
  try {
    const order = await Order.findOne({ _id: id })
    ctx.body = {
      status: 200,
      result: order
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}

export async function deleteOrder(ctx) {
  const { id } = ctx.params
  try {
    await Order.remove({ _id: id })
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

