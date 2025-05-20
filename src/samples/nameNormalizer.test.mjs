import {mapRange} from '../js/js'
import {Module} from '../js/module'

const count = 3

describe.each(mapRange(count, i => new Module(i)))
('source', currentModule => {
  beforeEach(async () => await currentModule.load())

  it('does something', () => {
    expect(currentModule.firstExportedFunction()).toEqual('hey 1')
  })
})
