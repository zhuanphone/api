const shortid = require('shortid')
const crypto = require('crypto')

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@')
const aa = shortid.generate()
console.log('aa: ', aa);

// 日期精确到秒 + hash会员id取尾数6位
const serialNum = Math.round(Date.now() / 1000)
const hashId = crypto.createHash('sha1').update(aa).digest('hex')
console.log('hashId: ', hashId);