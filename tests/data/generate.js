import Chance from 'chance'

const chance = new Chance()

export default {

  user: () => ({
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email(),
    username: chance.name(),
    password: chance.word({ length: 10 }),
  }),

  login: () => ({
    email: chance.email(),
    username: chance.name(),
    password: chance.word({ length: 10 }),
  }),

  test: () => ({
    name: chance.word(),
    userId: chance.integer(),
  }),
}
