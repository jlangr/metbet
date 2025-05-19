import { runTestsOnSource } from './runner.mjs'

describe('dynamic code test', () => {
  const source = `
    const add = (a, b) => a + b
    module.exports = { add }
  `

  it('adds numbers', () => {
    runTestsOnSource(source, ({ add }) => {
      expect(add(2, 3)).toBe(5)
      expect(add(-1, 1)).toBe(0)
    })
  })
})
