const joi = require('joi')
const sortTypes = require('../../database/enums/sortTypes')

module.exports = {
  create: joi.object().keys({
    name: joi.string().required(),
    userId: joi.string().guid().required(),
  }),
  addRating: joi.object().keys({
    rating: joi.number().integer().min(0).max(5).required(),
  }),
  addComment: joi.object().keys({
    text: joi.string().max(255).required(),
  }),
  findSortQuery: joi.object().keys({
    find: joi.string().max(20),
    sort: joi.string().allow(...Object.keys(sortTypes)),
  }),
}
