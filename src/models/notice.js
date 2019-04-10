import mongoose from 'mongoose'
const Schema = mongoose.Schema
import shortid from 'shortid'
import { NoticeStatusMap } from '../utils/const'

// 公告model
const Notice = new Schema({
  _id: { type: String, default: shortid.generate },
  created: { type: Date, default: Date.now },
  title: { type: String },
  message: { type: String },
  status: { type: String, default: NoticeStatusMap.ACTIVE } // 有效：ACITVE, 过期：EXPIRED
}, { versionKey: false })

export default mongoose.model('notice', Notice)
