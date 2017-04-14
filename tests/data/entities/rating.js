/* eslint-disable camelcase */
const db = require('../../../src/database/index')

module.exports = {
  addRating: (value, testModelId) => {
    return db.rating.create({
      rating: value,
      testModelId,
    })
  },
}
