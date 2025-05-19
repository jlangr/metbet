import {module} from '../js/modules.mjs'
import {mapRange} from "../js/js.mjs";

const count = 3

const prodModuleFilename = i => `examples/nameNormalizer/source.${i + 1}.mjs`;

describe.each(mapRange(count, i => module(prodModuleFilename(i))))
('source', (modulePath) => {
  let functionUnderTest

  beforeEach(async () => {
    const mod = await import(modulePath)
    functionUnderTest = mod.myFunction
  })

  it('does something', () => {
    expect(functionUnderTest()).toEqual('hey 1')
  })
})
