const chai = require('chai')

// Allows assertions on promises
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))

module.exports = chai
