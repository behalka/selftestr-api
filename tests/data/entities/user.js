const db = require('../../../src/database/index')

const modelUser = {
  id: '3e8c384f-2c19-4ea2-bc0b-02f0fe784ba2',
  username: 'behalkar',
  password: 'password',
  email: 'kbehalova@behalkar.cz',
}

const failedUser = {
  id: '3e8c384f-2c19-4ea2-bc0b-02f0fe784ba3',
  username: 'behalkar2',
  password: 'password',
  email: 'foo@behalkar.cz',
}

module.exports = {
  getModelUser: (props = {}) => Object.assign({}, modelUser, props),
  getUsers: () => ({
    modelUser,
    failedUser,
  }),
  create: (props = {}) => db.user.create(Object.assign({}, modelUser, props)),
  createAnother: () => db.user.create(failedUser),
  clean: () => db.user.sync({ force: true }),
}
