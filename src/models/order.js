import mongoose from 'mongoose'
const Schema = mongoose.Schema
import shortid from 'shortid'
import { PaymentState, OrderState } from '../utils/const'

const OrderGood = new Schema({
  good: { type: String, ref: 'good' },
  count: { type: Number, default: 1 }
}, {
    _id: false
  })

// 订单model
const Order = new Schema({
  _id: { type: String, default: shortid.generate },
  serialNum: { type: String },
  receiverAddress: { type: String }, // 收货地址
  receiverPhone: { type: Number }, // 收货人电话
  receiverName: { type: String }, // 收货人姓名
  releatedGoods: [OrderGood], // 关联的商品
  createdAt: { type: Date, default: Date.now }, // 订单创建日期
  completedAt: { type: Date }, // 订单完成时间
  total: { type: Number }, // 订单总金额 (包含商品价格，邮费等)
  adjustmentTotal: { type: Number }, // （除商品价格外，只包含邮费和其他费用）
  state: { type: String, default: OrderState.PAYMENT }, // 订单自身的状态
  paymentState: { type: String, default: PaymentState.BEPAID }, // 状态 待支付 BEPAID，已支付 PAIDED，支付失败 PAIDFAIL
}, { versionKey: false })

export default mongoose.model('order', Order)
