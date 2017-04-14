const db = require('../../src/database/index')
const crypto = require('../../src/utils/crypto')
const userHelper = require('./entities/user')

const modelUser = userHelper.getModelUser()

async function getOrCreateUser() {
  let user = await db.user.findOne({
    where: { id: modelUser.id },
  })
  if (!user) {
    user = await db.user.create(modelUser)
  }
  return user
}
async function generateToken() {
  const user = await getOrCreateUser()
  const token = await crypto.generateAccessToken(user.id, user.username)
  return token
}
function generateTokenFrom(user) {
  return crypto.generateAccessToken(user.id, user.username)
}

module.exports = {
  generateToken,
  generateTokenFrom,
}
