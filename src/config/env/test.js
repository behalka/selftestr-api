/* eslint-disable no-process-env */

export default {
  logging: {
    stdout: {
      enabled: true,
      level: 'error',
    },
  },
  database: {
    options: {
      dialectOptions: {
        ssl: false,
      },
      logging: false,
    },
    connectionString: process.env.DATABASE_URL_TEST
      || 'postgres://postgres:password@localhost:5432/koa-database-test',
  },
}
