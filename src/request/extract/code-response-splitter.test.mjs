import {CodeResponseSplitter} from './code-response-splitter.mjs'
import {createSourceFile} from './source-file.mjs'
import {createFiles} from './files.mjs'
import {FileType} from './file-type.mjs'

const fizzBuzzProdSource = 'export const fizz = () => {}'
const helperProdSource = 'export const helper = () => {}'
const fizzBuzzTestSource = 'it(\'does stuff\', () => {})'

describe('codeResponseSplitter', () => {
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

  it('splits out single prod file', () => {
    const files = CodeResponseSplitter().split(`/* prod module x.mjs */
${fizzBuzzProdSource}
/* end prod module */`)

    const expected = createFiles(
      [createSourceFile(FileType.PROD, fizzBuzzProdSource, 'x.mjs')],
      [])

    expect(JSON.stringify(files)).toEqual(JSON.stringify(expected))
  })
})
