/* eslint-disable no-process-env */

import pkg from '../../package'

export default {
  appName: 'selftestr-api',
  version: pkg.version,
  port: process.env.PORT || 3000,
  auth: {
    pepper: 'mEOLaKAkgnr0z/IzS9bju4xquOk',
    saltRounds: 10,
    resetPasswordTokenLength: 20,
    tokenExpiration: 2 * 60 * 60, // 2 hours (in seconds)
  },
  database: {
    options: {
      dialectOptions: {
        ssl: true,
      },
      logging: false,
    },
    connectionString: process.env.DATABASE_URL
      || 'postgres://postgres:password@192.168.99.100:5432/koa-database',
  },
  logging: {
    stdout: {
      enabled: true,
      level: 'debug',
    },
  },
}
