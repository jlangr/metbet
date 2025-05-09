import { CodeResponseSplitter } from './code-response-splitter.mjs'
import { createSourceFile } from './source-file.mjs'
import { createFiles } from './files.mjs'
import { FileType } from './file-type.mjs'

const fizzBuzzProdSource = 'export const fizz = () => {}'
const helperProdSource = 'export const helper = () => {}'
const fizzBuzzTestSource = 'it(\'does stuff\', () => {})'

describe('codeResponseSplitter', () => {
  it('splits --failed', () => {
    const response =  '/* prod module fizzBuzzDigit.mjs */\n' +
      "import { isDivisibleByThree, isDivisibleByFive } from './utils.mjs'\n" +
      '\n' +
      'const fizzBuzzDigit = (num) => {\n' +
      '  if (isDivisibleByThree(num) && isDivisibleByFive(num)) {\n' +
      "    return 'FizzBuzz'\n" +
      '  }\n' +
      '  if (isDivisibleByThree(num)) {\n' +
      "    return 'Fizz'\n" +
      '  }\n' +
      '  if (isDivisibleByFive(num)) {\n' +
      "    return 'Buzz'\n" +
      '  }\n' +
      '  return num\n' +
      '}\n' +
      '\n' +
      'export default fizzBuzzDigit\n' +
      '/* end prod module */\n' +
      '\n' +
      '/* prod module utils.mjs */\n' +
      'const isDivisibleByThree = (num) => num % 3 === 0\n' +
      'const isDivisibleByFive = (num) => num % 5 === 0\n' +
      '\n' +
      'export { isDivisibleByThree, isDivisibleByFive }\n' +
      '/* end prod module */\n' +
      '\n' +
      '/* test module fizzBuzzDigit.test.mjs */\n' +
      "import fizzBuzzDigit from './fizzBuzzDigit.mjs'\n" +
      '\n' +
      "describe('fizzBuzzDigit', () => {\n" +
      "  it('returns Fizz when input is divisible by 3', () => {\n" +
      "    expect(fizzBuzzDigit(6)).toBe('Fizz')\n" +
      "    expect(fizzBuzzDigit(9)).toBe('Fizz')\n" +
      '  })\n' +
      '\n' +
      "  it('returns Buzz when input is divisible by 5', () => {\n" +
      "    expect(fizzBuzzDigit(5)).toBe('Buzz')\n" +
      "    expect(fizzBuzzDigit(10)).toBe('Buzz')\n" +
      '  })\n' +
      '\n' +
      "  it('returns FizzBuzz when input is divisible by 3 and 5', () => {\n" +
      "    expect(fizzBuzzDigit(15)).toBe('FizzBuzz')\n" +
      '  })\n' +
      '\n' +
      "  it('returns input when it is not divisible by 3 or 5', () => {\n" +
      '    expect(fizzBuzzDigit(4)).toBe(4)\n' +
      '  })\n' +
      '})\n' +
      '/* end test module */'


    const files = CodeResponseSplitter().split(response)
    console.log(files)
  })

  it('splits multiple files', () => {
    const response = `/* prod module fizz-buzz.mjs */
${fizzBuzzProdSource}
/* end prod module */

/* prod module helper.mjs */
${helperProdSource}
/* end prod module */

/* test module fizz-buzz.test.mjs */
${fizzBuzzTestSource}
/* end test module */`

    const files = CodeResponseSplitter().split(response)

    const expected = createFiles(
      [
        createSourceFile(FileType.PROD, fizzBuzzProdSource, 'fizz-buzz.mjs'),
        createSourceFile(FileType.PROD, helperProdSource, 'helper.mjs')
      ],
      [createSourceFile(FileType.TEST, fizzBuzzTestSource, 'fizz-buzz.test.mjs')],
    )

    expect(JSON.stringify(files)).toEqual(JSON.stringify(expected))
  })
})
