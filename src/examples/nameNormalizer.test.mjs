import {module} from '../js/modules.mjs'
import {mapRange} from "../js/js.mjs"

const count = 3

class ProdModule {
  constructor(index) {
    this.prodModuleFilename = `examples/nameNormalizer/source.${index + 1}.mjs`
  }

  async load() {
    this.mod = await import(module(this.prodModuleFilename))
  }

  get functionUnderTest() {
    return this.mod.myFunction
  }
}

describe.each(mapRange(count, i => new ProdModule(i)))
('source', module => {
  beforeEach(async () => {
    await module.load()
  })

  it('does something', () => {
    expect(module.functionUnderTest()).toEqual('hey 1')
  })
})
