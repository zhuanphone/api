const crypto = require('crypto')
const qs = require('qs')
const md5 = require('md5')

// user.id | order._id
export function genSerialNumWithId(id) {
  const time = Math.round(Date.now() / 1000)
  const hashId = crypto.createHash('sha1').update(id).digest('hex')
  return time + hashId.substring(hashId.length - 6).toUpperCase()
}


export function signature(params, key) {
  params = sortByObjectKey(params)
  console.log('params: ', params);
  const strparams = qs.stringify(params, { encode: false }) + `&key=${key}`
  return md5(strparams).toUpperCase()
}


export function sortByObjectKey(unordered) {
  let ordered = {}
  Object.keys(unordered).sort().forEach((key) => {
    ordered[key] = unordered[key]
  })
  return ordered
}