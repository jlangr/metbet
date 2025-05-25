// __tests__/mapRange.test.ts
import { mapRange } from './js'

describe('mapRange', () => {
  it('maps 0 elements to an empty array', () => {
    const result = mapRange(0, i => i * 2)
    expect(result).toEqual([])
  })

  it('maps a range of 3 using identity', () => {
    const result = mapRange(3, i => i)
    expect(result).toEqual([0, 1, 2])
  })

  it('applies the function to each index', () => {
    const result = mapRange(4, i => i * i)
    expect(result).toEqual([0, 1, 4, 9])
  })

  it('works with string results', () => {
    const result = mapRange(3, i => `#${i}`)
    expect(result).toEqual(['#0', '#1', '#2'])
  })

  it('throws if fn is not a function', () => {
    expect(() => mapRange(3, null)).toThrow()
  })
})
