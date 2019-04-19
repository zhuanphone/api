import mongoose from 'mongoose'
const Schema = mongoose.Schema
import shortid from 'shortid'
import { OrderStatusMap } from '../utils/const'

const OrderGood = new Schema({
  id: { type: String, ref: 'good' },
  count: { type: Number, default: 1 }
})

// 订单model
const Order = new Schema({
  _id: { type: String, default: shortid.generate },
  serialNum: { type: String },
  address: { type: String }, // 收货地址
  phone: { type: Number }, // 收货人电话
  receivername: { type: String }, // 收货人姓名
  // userId: { type: String, ref: 'user' },   // 用户手机
  goods: [OrderGood],
  created: { type: Date, default: Date.now },
  amount: { type: Number }, // 订单总金额
  deliveryAddr: { type: String }, // 发送地址
  status: { type: String, default: OrderStatusMap.BEPAID }, // 状态 待支付 BEPAID，已支付 PAIDED，支付失败 PAIDFAIL
  freight: { type: Number }, // 运费
}, { versionKey: false })

export default mongoose.model('order', Order)
