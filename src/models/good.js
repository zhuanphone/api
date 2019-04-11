import mongoose from 'mongoose'
import shortid from 'shortid'
import { GoodStatusMap } from '../utils/const'

const GoodImg = new mongoose.Schema({
  uid: { type: String },
  url: { type: String },
  name: { type: String }
})

// 商品model
const Good = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  brand: { type: String },
  name: { type: String },
  created: { type: Date, default: Date.now },
  coverImg: { type: String },
  imgs: [GoodImg],
  desc: { type: String },
  originPrice: { type: Number, default: 100 },
  purchasePrice: { type: Number, default: 100 },
  onShelve: { type: String, default: GoodStatusMap.WILLSHELVES }, // 待上架：0, will_shelves | 1, 已上架on_shelves | -1,  已下架down_shelves
  saleCount: { type: Number, default: 0 }
}, { versionKey: false })

export default mongoose.model('good', Good)
