const Promise = require('bluebird')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config')

/**
 * Apply system-configured pepper to any given string
 *
 * @param {String} string The string to pepperify
 * @return {String} SHA-1 hash of the input string with pepper applied
 */
function pepperify(string) {
  return crypto
    .createHmac('sha1', new Buffer(config.auth.pepper))
    .update(string)
    .digest('hex')
}

module.exports = {
  generateAccessToken: (userId, username) => {
    const payload = { userId, username }
    
    return jwt.sign(payload, config.auth.tokenSecret, { expiresIn: config.auth.tokenExpiration })
  },
  hashPassword: password => {
    return Promise.fromCallback(done =>
      bcrypt.hash(pepperify(password), config.auth.saltRounds, done)
    )
  },
  comparePasswords: (plaintext, ciphertext) => {
    return Promise.fromCallback(done =>
      bcrypt.compare(pepperify(plaintext), ciphertext, done)
    )
  },
  generateResetPasswordToken: async () => {
    const bytes = await Promise.fromCallback(done =>
      crypto.randomBytes(config.auth.resetPasswordTokenLength, done)
    )
    return bytes.toString('hex')
  },
}
