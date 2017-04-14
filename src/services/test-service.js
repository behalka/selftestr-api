const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')

function getTestRanking(testModelId) {
  const query = `
    SELECT SUM(rating) as sum, COUNT(rating) as count
    FROM test_model_rating
    WHERE test_model_id=:id
  `
  return db.sequelize.query(query, {
    replacements: {
      id: testModelId,
    },
    type: db.sequelize.QueryTypes.SELECT,
  })
}

module.exports = {
  getTestRanking,
  getAll: () => {
    return db.testModel.findAll({
      include: [{ model: db.questionModel, attributes: [] }],
      group: ['testModel.id'],
      attributes: {
        include: [[db.sequelize.fn('COUNT',
          db.sequelize.col('questionModels.id')),
          'questionsCount',
        ]],
      },
    })
  },
  addRating: async (id, user, ratingValue) => {
    const test = await db.testModel.findOne({
      where: { id },
    })
    if (!test) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `Test with id ${id} does not exist.`)
    }
    if (user) {
      const userModel = await db.user.findOne({
        where: { id: user.id },
      })
      if (!userModel) {
        throw new errors.NotFoundError('E_NOTFOUNT_USER', `User with id ${user.id} does not exist.`)
      }
    }
    const rating = await db.rating.create({
      testModelId: id,
      userId: user ? user.id : null,
      rating: ratingValue,
    }, {
      returning: true,
    })
    return rating
  },
  get: async id => {
    const test = await db.testModel.findOne({
      where: { id },
      include: [{ model: db.questionModel, include: [db.answerModel] }],
    })
    if (!test) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `Test with id ${id} does not exist.`)
    }
    return test
  },
  createTest: async test => {
    const owner = await db.user.findOne({ id: test.userId })
    if (!owner) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `User ${test.userId} does not exist.`)
    }
    return db.testModel.create(test, { include: [db.questionModel] })
  },
}
