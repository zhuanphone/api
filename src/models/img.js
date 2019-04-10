import mongoose from 'mongoose'
const Schema = mongoose.Schema
import shortid from 'shortid'

// 公告model
const Img = new Schema({
  _id: { type: String, default: shortid.generate },
  created: { type: Date, default: Date.now },
  domain: { type: String },
  hash: { type: String }
}, { versionKey: false })

Img.virtual('url').get(function () {
  return `http://${this.domain}/${thsi.hash}`
})

export default mongoose.model('img', Img)
