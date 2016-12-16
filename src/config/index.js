/* eslint-disable no-process-env, import/first */

import dotenv from 'dotenv'

// Load process.env variables from .env file
// !! Do not move this line, config varibles have to be loaded before default config is loaded.
dotenv.config({ silent: false })

import _ from 'lodash'
import defaultConfig from './default'

const env = process.env.NODE_ENV || 'development'
const envConfigPath = `./env/${env}`
const envConfig = require(envConfigPath)

// Override default values with values from environment config
const resultConfig = _.merge({}, defaultConfig, envConfig)
export default resultConfig
