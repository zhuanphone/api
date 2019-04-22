import Order from '../../models/order'
import shortid from 'shortid'
import qs from 'qs'
import { signature, genSerialNumWithId } from '../../utils/common';

export async function getOrders(ctx) {
  let { page, limit, sort } = ctx.request.query
  page = Number(page) || 1
  limit = Number(limit) || 10
  sort = sort || '-createdAt'

  let query = {}
  // if (keyword) query['name'] = { $regex: keyword }

  try {
    const total = await Order.count({})
    const orders = await Order
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .populate({ path: 'releatedGoods.good' })
      .lean()

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
  // const user = ctx.state.user
  const order = new Order(ctx.request.body)
  // 生成订单唯一数字编号
  const serialNum = genSerialNumWithId(order._id)
  order.serialNum = serialNum

  // 返回收银台跳转地址
  const mchid = '1532210401'
  const key = 'nSXUfa4m1Tf01yrf'

  const data = {
    body: `订单-${serialNum}`,
    // notify_url: 'http://www.zhuanzhuancn.com:5000/api/v1/orders/weixin/notify',
    callback_url: 'http://www.zhuanzhuancn.com:4000/paysuc',
    mchid,
    out_trade_no: serialNum,
    total_fee: order.total * 100
    // total_fee: 1
  }

  data.sign = signature(data, key)

  const payurl = 'https://payjs.cn/api/cashier?' + qs.stringify(data, { encode: false })

  try {
    await order.save()
    const response = order.toJSON()

    ctx.status = 201
    ctx.body = {
      status: 201,
      result: {
        order: response,
        payurl
      }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      result: err.message
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

