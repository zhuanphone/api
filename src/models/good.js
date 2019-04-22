import mongoose from 'mongoose'
import shortid from 'shortid'
import { GoodStatusMap, PostageOpts } from '../utils/const'
import Order from './order'

const GoodImg = new mongoose.Schema({
  uid: { type: String },
  url: { type: String },
  name: { type: String }
}, {
    _id: false
  })

const PhoneSchema = new mongoose.Schema({
  model: { type: String }, // 型号
  color: { type: String }, // 颜色
  capacity: { type: String }, // 容量
  release: { type: String }, // 发行版本
  network: { type: String }, // 手机网络
  quality: { type: String }, // 成色
  warranty: { type: String }, // 保修
  borderShell: { type: String }, // 边框外壳
  screen: { type: String }, // 屏幕
  maintainHistory: { type: String }, // 维修历史
  account: { type: String }, // 账号密码
  funcProblem: { type: String }, // 功能性问题
})

// 商品model
const Good = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  type: { type: String }, // 商品类型 Phone, Watch, Other
  title: { type: String }, // 标题
  createdAt: { type: Date, default: Date.now },
  coverImg: { type: String },
  imgs: [GoodImg],
  desc: { type: String },
  postage: { type: String, default: PostageOpts.SHIPPING }, // 邮费： 包邮，到付，10, 20
  originPrice: { type: Number, default: 100 },
  purchasePrice: { type: Number, default: 100 },
  onShelve: { type: String, default: GoodStatusMap.WILLSHELVES }, // 待上架：0, will_shelves | 1, 已上架on_shelves | -1,  已下架down_shelves
  properties: { type: String } // JSON.stringify

}, {
    versionKey: false,
  })

export default mongoose.model('good', Good)
