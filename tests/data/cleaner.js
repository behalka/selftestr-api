const db = require('../../src/database')

function resetDb() {
  return db.sequelize.sync({ force: true })
}

module.exports = {
  resetDb,
}
