module.exports = {
  auth: {
    tokenExpiration: 6 * 60 * 60, // 2 hours (in seconds)    
  },
  database: {
    options: {
      dialectOptions: {
        ssl: false,
      },
      logging: console.log,
    },
  },
}
