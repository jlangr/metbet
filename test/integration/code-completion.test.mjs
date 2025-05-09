import {createExample} from '../../src/prompt-clients/example.mjs'
import {createExampleList} from '../../src/prompt-clients/example-list.mjs'
import {FileType} from '../../src/prompt-clients/file-type.mjs'
import {requestCodeCompletion} from '../../src/prompt-clients/code-completion.mjs'

describe('live prompt integration', () => {
  it('sends actual prompt to LLM and splits response into prod/test files', async () => {
    const description = 'Generate a solution for "fizzbuzz digits" only, and not the sequence.';
    const examples = createExampleList([
      createExample('1', 'divisible by 3', 'fizzbuzzDigit(6) -> Fizz\nfizzBuzzDigit(9) -> Fizz'),
      createExample('2', 'divisible by 5', 'fizzBuzzDigit(5) -> Fizz\nfizzBuzzDigit(10) -> Buzz'),
      createExample('3', 'divisible by 3 and 5', 'fizzBuzzDigit(15) -> FizzBuzz'),
      createExample('4', 'otherwise returns input', 'fizzBuzzDigit(4) -> 4')
    ])

    const files = await requestCodeCompletion(description, examples);

    const prod = files.prodFiles[0]
    expect(prod.type).toBe(FileType.PROD)
    expect(prod.name).toMatch(/\.mjs$/)
    expect(prod.content).toMatch(/Fizz/)
    expect(prod.content).toMatch(/Buzz/)
    const test = files.testFiles[0]
    expect(test.type).toBe(FileType.TEST)
    expect(test.name).toMatch(/\.test\.mjs$/)
    expect(test.content).toMatch(/it\('/)
    expect(test.content).toMatch(/expect\(/)
  }, 30000)
})
