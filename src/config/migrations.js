/* eslint-disable camelcase */

const dotenv = require('dotenv')

dotenv.config({ silent: false })

module.exports = {
  development: {
    use_env_variable: 'MIGRATION_DATABASE_URL_DEV',
  },
  test: {
    use_env_variable: 'MIGRATION_DATABASE_URL_TEST',
  },
  beta: {
    use_env_variable: 'MIGRATION_DATABASE_URL_BETA',
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },

  },
  production: {
    use_env_variable: 'MIGRATION_DATABASE_URL_PROD',
  },
}
