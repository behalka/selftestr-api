const joi = require('joi')

module.exports = {
  create: joi.object().keys({
    name: joi.string().required(),
    userId: joi.string().guid().required(),
  }),
}
