const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')
const sortEnum = require('../database/enums/sortTypes')

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

async function setRatings(testModels = []) {
  for (const test of testModels) {
    const { sum, count } = (await getTestRanking(test.id))[0]
    test.ratingValue = sum / count
    test.ratingCount = count
  }
  return testModels
}

function buildSortQuery(sortQuery) {
  switch (sortQuery) {
    case sortEnum.rating:
      throw new errors.ApiError('API_ERROR', 'not supported yet :(')
    case sortEnum.latest:
      return [
        ['created_at', 'DESC'],
      ]
    case sortEnum.alphabet:
      return [
        [db.sequelize.fn('lower', db.sequelize.col('name')), 'ASC'],
      ]
    default:
      throw new errors.ValidationError(`Invalid sort option ${sortQuery}.`)
  }
}

function buildFindQuery(findQuery, sortQuery) {
  const find = findQuery ? {
    $or: [
      // name - case insensitive
      db.sequelize.where(
        db.sequelize.fn('lower', db.sequelize.col('name')),
        { $like: db.sequelize.fn('lower', `%${findQuery}%`) }
      ),
      // desc
      {
        description: {
          $like: `%${findQuery}%`,
        },
      },
    ],
  } : {}
  const sort = sortQuery
  ? buildSortQuery(sortQuery)
  : []
  return {
    where: find,
    order: sort,
  }
}

module.exports = {
  setRatings,
  getTestRanking,
  getAll: (findQuery, sortQuery) => {
    const options = buildFindQuery(findQuery, sortQuery)
    return db.testModel.findAll(Object.assign({}, options, {
      include: [{ model: db.comment }],
    }))
  },
      // include: [{ model: db.questionModel, attributes: [] }],
      // tohle je sequelize agregovany dotaz - priklad!
      // group: ['testModel.id'],
      // attributes: {
      //   include: [[db.sequelize.fn('COUNT',
      //     db.sequelize.col('questionModels.id')),
      //     'questionsCount',
      //   ]],
      // },
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
      include: [
        { model: db.questionModel, include: [db.answerModel] },
        { model: db.comment },
      ],
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
