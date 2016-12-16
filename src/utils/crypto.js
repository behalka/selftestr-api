import Promise from 'bluebird'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from '../config'

export default {

  generateAccessToken(userId) {
    const payload = { userId }
    return jwt.sign(payload, config.auth.pepper, { expiresIn: config.auth.expiration })
  },

  hashPassword(password) {
    return Promise.fromCallback(done =>
      bcrypt.hash(pepperify(password), config.auth.saltRounds, done)
    )
  },

  comparePasswords(plaintext, ciphertext) {
    return Promise.fromCallback(done =>
      bcrypt.compare(pepperify(plaintext), ciphertext, done)
    )
  },

  async generateResetPasswordToken() {
    const bytes = await Promise.fromCallback(done =>
      crypto.randomBytes(config.auth.resetPasswordTokenLength, done)
    )

    return bytes.toString('hex')
  },
}

/**
 * Apply system-configured pepper to any given string
 *
 * @param {String} string The string to pepperify
 * @return {String} SHA-1 hash of the input string with pepper applied
 */
function pepperify(string) {
  return crypto
    .createHmac('sha1', config.auth.pepper)
    .update(string)
    .digest('hex')
}
