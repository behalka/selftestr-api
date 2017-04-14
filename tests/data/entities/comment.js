/* eslint-disable camelcase */
const db = require('../../../src/database/index')

module.exports = {
  addComment: (value, testModelId, userId) => {
    return db.comment.create({
      text: value,
      testModelId,
      userId,
    })
  },
}
