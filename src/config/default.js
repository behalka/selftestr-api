/* eslint-disable no-process-env */

const pkg = require('../../package')

module.exports = {
  appName: 'selftestr-api',
  version: pkg.version,
  port: process.env.PORT || 3000,
  auth: {
    pepper: process.env.PEPPER || 'also_a_long_string',
    // salt: process.env.SALT || 'long_enough_random_string',
    saltRounds: 10,
    resetPasswordTokenLength: 20,
    tokenExpiration: 2 * 60 * 60, // 2 hours (in seconds)
    tokenSecret: process.env.TOKEN_SECRET || 'also_a_long_string',
  },
  database: {
    options: {
      dialectOptions: {
        ssl: true,
      },
      logging: false,
    },
    connectionString: process.env.DATABASE_URL
      || 'postgres://postgres:password@0.0.0.0:5432/koa-database',
  },
  logging: {
    stdout: {
      enabled: true,
      level: 'debug',
    },
  },
}
