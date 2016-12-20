import joi from 'joi'

export const register = joi.object().keys({
  username: joi.string().required(),
  email: joi.string().required(),
  firstName: joi.string(),
  lastName: joi.string(),
  password: joi.string().min(5).required(),
})

export const resetPassword = joi.object().keys({
  email: joi.string().required(),
})
