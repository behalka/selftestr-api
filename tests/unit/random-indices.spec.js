const rand = require('../../src/utils/randomIndices')
const expect = require('../common/chai').expect

describe('generates random unique numbers with upper limit', () => {
  it('returns an array with given length', () => {
    const res = rand.randomUniqueIndices(5, 3)
    expect(res).to.be.a('array')
    expect(res.length).to.equal(3)
  })
  it('result contains numbers with upper limit', () => {
    const res = rand.randomUniqueIndices(5, 3)
    for (const nr of res) {
      expect(nr).to.be.a('number')
      expect(nr).to.be.below(5)
      expect(nr).to.be.least(0)
    }
  })
})
