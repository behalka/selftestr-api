const joi = require('joi')

module.exports = {
  create: joi.object().keys({
    name: joi.string().required(),
    userId: joi.string().guid().required(),
  }),
  addRating: joi.object().keys({
    rating: joi.number().integer().min(0).max(5).required(),
  }),
}
