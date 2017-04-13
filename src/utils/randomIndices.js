const _ = require('lodash')

function randomUniqueIndices(len, count) {
  const indices = []
  let result = []
  if (!count || !_.isNumber(count) || count > len || count <= 0) {
    count = len
  }
  while (len > 0) {
    indices.push(len - 1)
    len--
  }
  while (count > 0) {
    const index = _.random(0, indices.length - 1)
    const resArray = indices.splice(index, 1)
    result = result.concat(resArray)
    count--
  }
  return result
}

module.exports = {
  randomUniqueIndices,
}
