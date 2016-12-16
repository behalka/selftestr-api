import bunyan from 'bunyan'
import config from '../config'

const logStreams = []

// Stdout stream
if (config.logging.stdout.enabled) {
  logStreams.push({
    level: config.logging.stdout.level,
    name: 'console',
    stream: process.stdout,
  })
}

const logger = bunyan.createLogger({
  name: config.appName,
  streams: logStreams,
})

export default logger
