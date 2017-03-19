const db = require('../../../src/database/index')

const modelUser = {
  id: '3e8c384f-2c19-4ea2-bc0b-02f0fe784ba2',
  username: 'behalkar',
  password: 'password',
  email: 'kbehalova@behalkar.cz',
}

module.exports = {
  getModelUser: (props = {}) => Object.assign({}, modelUser, props),
  create: (props = {}) => db.user.create(Object.assign({}, modelUser, props)),
  clean: () => db.user.sync({ force: true }),
}
