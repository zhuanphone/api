import mongoose from 'mongoose'
const Schema = mongoose.Schema
import shortid from 'shortid'
import { OrderStatusMap } from '../utils/const'

const OrderCommodity = new Schema({
  commodityId: { type: String, ref: 'commodity' },
  count: { type: Number, default: 1 }
})

// 订单model
const Order = new Schema({
  _id: { type: String, default: shortid.generate },
  userId: { type: String, ref: 'user' },   // 用户手机
  commodities: [OrderCommodity],
  created: { type: Date, default: Date.now },
  amount: { type: String }, // 订单总金额
  cmdCount: { type: Number, default: 1 }, // 订单含有商品总数量
  deliveryAddr: { type: String }, // 发送地址
  status: { type: String, default: OrderStatusMap.BEPAID }, // 状态 待支付 BEPAID，已支付 PAIDED，支付失败 PAIDFAIL
}, { versionKey: false })

export default mongoose.model('order', Order)
