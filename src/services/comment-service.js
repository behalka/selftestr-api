const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')

module.exports = {
  add: async (payload, user, testModelId) => {
    const testModel = await db.testModel.findOne({
      where: { id: testModelId },
    })
    if (!testModel) {
      throw new errors.NotFoundError('TESTMODEL_NOT_FOUND',
        `TestModel with id ${testModelId} not found.`)
    }
    const comment = await db.comment.create({
      text: payload.text,
      userId: user.id,
      testModelId,
    }, {
      returning: true,
    })
    return comment
  },
}
