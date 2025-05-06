import { mostFrequentWord } from './mostFrequentWord.mjs'

describe('mostFrequentWord', () => {
  it('returns null for empty string', () => {
    expect(mostFrequentWord('')).toBeNull()
  })

  it('returns sole word for single-word string', () => {
    expect(mostFrequentWord('smelt')).toBe('smelt')
  })

  it('returns highest frequency word for multi-word string', () => {
    expect(mostFrequentWord('was it a car or a cat I saw')).toBe('a')
  })

  it('returns first word in case of tie', () => {
    expect(mostFrequentWord('run fast jump high run far jump now')).toBe('run')
  })

  it('is case insensitive', () => {
    expect(mostFrequentWord('Monster walks the winter lake')).toBe('monster')
  })

  it('ignores extraneous whitespace', () => {
    expect(mostFrequentWord('\t\n\rCry  \v\fBaby Baby   ')).toBe('baby')
  })

  it('throws when input not a string', () => {
    expect(() => mostFrequentWord(null)).toThrow(new Error('null input not supported'))
  })
})
