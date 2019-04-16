const crypto = require('crypto')
const qs = require('qs')
// const md5 = require('md5')

export function genSerialNum(userId) {
  const time = Math.round(Date.now() / 1000)
  const hashId = crypto.createHash('sha1').update(userId).digest('hex')
  return time + hashId.substring(hashId.length - 6).toUpperCase()
}

export function signature(params, key) {
  params = sortByObjectKey(params)
  console.log('params: ', params);
  const strparams = qs.stringify(params, { encode: false }) + `&key=${key}`
  return md5(strparams).toUpperCase()
}

export function sign(params, key) {
  let strParams = toQueryString(params)
  strParams += `$key=${key}`
  return md5(strParams).toUpperCase()
}

const toQueryString = (obj) => Object.keys(obj)
  .filter(key => key !== 'sign' && obj[key] !== undefined && obj[key] !== '')
  .sort()
  .map(key => {
    if (/^http(s)?:\/\//.test(obj[key])) { return key + '=' + encodeURI(obj[key]) } else { return key + '=' + obj[key] }
  })
  .join('&')

const md5 = (str, encoding = 'utf8') => crypto.createHash('md5').update(str, encoding).digest('hex')

export function sortByObjectKey(unordered) {
  let ordered = {}
  Object.keys(unordered).sort().forEach((key) => {
    ordered[key] = unordered[key]
  })
  return ordered
}

// function md5(str) {
//   var encoding = arguments[1] !== (void 0) ? arguments[1] : 'utf8';
//   return crypto.createHash('md5').update(str, encoding).digest('hex');
// };