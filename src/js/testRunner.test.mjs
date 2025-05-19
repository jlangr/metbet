import { runIsolatedTest } from './testRunner.mjs'

describe('runIsolatedTest', () => {
  it('executes isolated tests with assert', () => {
    const prod = `
      const triple = x => x * 3
      module.exports = triple
    `

    const test = `
      assert.strictEqual(triple(3), 9)
      assert.strictEqual(triple(-1), -3)
    `

    runIsolatedTest(prod, test, 'triple')
  })
})
