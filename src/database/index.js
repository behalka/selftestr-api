const Sequelize = require('sequelize')
const config = require('../config/index')
const models = require('./models')
const pg = require('pg')

/* aggregate functions return integer instead of a string if possible */
pg.defaults.parseInt8 = true
const sequelize = new Sequelize(config.database.connectionString, config.database.options)

// Import all models
const db = {}
Object.entries(models).forEach(([modelName, modelDef]) => {
  const model = sequelize.import(modelName, modelDef)
  db[model.name] = model
})

// Load relations between models
Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
