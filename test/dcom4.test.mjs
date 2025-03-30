import { calculateDCOM4 } from '../src/dcom4'

describe('DCOM4 cohesion metric', () => {
  const cases = [
    {
      description: 'Cohesion is high when all functions access a single variable',
      code: `
        let counter = 0
        const increment = () => { counter++ }
        const reset = () => { counter = 0 }
        const double = () => { counter *= 2 }
      `,
      expected: 1
    },
    {
      description: 'Cohesion remains high when functions access shared state indirectly',
      code: `
        let value = 10
        const add = () => { value += 1 }
        const multiply = () => { value *= 2 }
        const report = () => { return multiply() }
      `,
      expected: 1
    },
    {
      description: 'Cohesion drops when functions form two isolated groups',
      code: `
        let count = 0
        let log = []
        const increment = () => { count++ }
        const reset = () => { count = 0 }
        const addLog = (msg) => { log.push(msg) }
        const clearLog = () => { log = [] }
      `,
      expected: 2
    },
    {
      description: 'Cohesion is low when all functions access completely separate state',
      code: `
        let a = 1, b = 2, c = 3
        const incA = () => { a++ }
        const incB = () => { b++ }
        const incC = () => { c++ }
      `,
      expected: 3
    },
    {
      description: 'Cohesion remains high if a single function connects otherwise isolated ones',
      code: `
        let x = 0, y = 0
        const useX = () => { x++ }
        const useY = () => { y++ }
        const useBoth = () => { x += 2; y += 2 }
      `,
      expected: 1
    },
    {
      description: 'Cohesion is low when only one function accesses shared state',
      code: `
        let score = 0
        const getScore = () => score
        const announce = () => "Game on!"
        const help = () => "Press start"
      `,
      expected: 1
    },
    {
      description: 'Cohesion is trivially high in a single-function module',
      code: `
        let cache = {}
        const clearCache = () => { cache = {} }
      `,
      expected: 1
    },
    {
      description: 'filters out non-stateful (pure) functions',
      code: `
        let shared = 0
        const a = () => shared++
        const b = () => shared--
        const pure1 = () => 42
        const pure2 = () => 'hi'
      `,
      expected: 1
    },
    {
      description: 'Cohesion is high when all methods access the same field',
      code: `
        class Counter {
          constructor() { this.count = 0 }
          increment() { this.count++ }
          reset() { this.count = 0 }
          double() { this.count *= 2 }
        }
      `,
      expected: 1
    },
    {
      description: 'Cohesion drops when methods form two isolated access groups',
      code: `
        class Dual {
          constructor() { this.a = 0; this.b = 0 }
          incA() { this.a++ }
          resetA() { this.a = 0 }
          incB() { this.b++ }
          resetB() { this.b = 0 }
        }
      `,
      expected: 2
    },
    {
      description: 'Global functions and class methods sharing the same variable are cohesive',
      code: `
        let shared = 0
        class Mixer {
          inc() { shared++ }
          double() { shared *= 2 }
        }
        const reset = () => { shared = 0 }
        const triple = () => { shared *= 3 }
      `,
      expected: 1
    }
  ]

  for (const { description, code, expected } of cases) {
    it(description, () => {
      expect(calculateDCOM4(code)).toBe(expected)
    })
  }
})
