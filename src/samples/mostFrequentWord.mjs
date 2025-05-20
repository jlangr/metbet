export const mostFrequentWord = input => {
  if (typeof input !== 'string') throw new Error('null input not supported')

  const matches = input.match(/\b\w+\b/g)
  if (!matches) return null

  const words = matches.map(w => w.toLowerCase())

  const freq = words.reduce((map, word) => ({
    ...map,
    [word]: (map[word] || 0) + 1
  }), {})

  return words.reduce((top, word, i) =>
    freq[word] > freq[top] ? word : top
  )
}
