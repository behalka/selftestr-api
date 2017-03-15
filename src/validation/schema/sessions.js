const joi = require('joi')

const create = joi.object().keys({
  email: joi.string().required(),
  password: joi.string().min(5).required(),
  username: joi.string().required(),
})

module.exports = {
  create,
}
