/* eslint-disable no-process-env, import/first */

const dotenv = require('dotenv')

// Load process.env variables from
// !! Do not move this line, config varibles have to be loaded before default config is loaded.
dotenv.config({ silent: false })

const _ = require('lodash')
const defaultConfig = require('./default')

const env = process.env.NODE_ENV || 'development'
const envConfigPath = `./env/${env}`
const envConfig = require(envConfigPath)

// Override default values with values from environment config
const resultConfig = _.merge({}, defaultConfig, envConfig)
module.exports = resultConfig
