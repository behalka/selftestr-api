const joi = require('joi')

module.exports = {
  register: joi.object().keys({
    username: joi.string().required(),
    email: joi.string().required(),
    firstName: joi.string(),
    lastName: joi.string(),
    password: joi.string().min(5).required(),
  }),
  resetPassword: joi.object().keys({
    email: joi.string().required(),
  }),
}
