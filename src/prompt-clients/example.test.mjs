import { createExample } from './example.mjs'

describe('example', () => {
  it('creates prompt string when only example text provided', () => {
    const example = createExample('1', '', 'some text')
    expect(example.toPromptText()).toBe('some text')
  })

  it('creates prompt string when example text and name provided', () => {
    const example = createExample('1', 'my name', 'some text')
    expect(example.toPromptText()).toBe('name: my name\nsome text')
  })

  it('does not append name if null', () => {
    const example = createExample('1', null, 'some text')
    expect(example.toPromptText()).toBe('some text')
  })

  it('is enabled by default', () => {
    const example = createExample('1', '', 'some text')
    expect(example.isEnabled()).toBe(true)
  })
})
