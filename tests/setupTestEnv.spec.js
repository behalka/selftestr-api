const reset = require('./data/cleaner')

before(() => reset.resetDb())
