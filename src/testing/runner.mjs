import vm from 'node:vm'

const createContext = () =>
  vm.createContext({ exports: {}, module: { exports: {} } })

const evaluateSource = (source, context) =>
  vm.runInContext(source, context)

const getExport = context =>
  context.module.exports || context.exports

const runTestsOnSource = (source, testFn) => {
  const context = createContext()
  evaluateSource(source, context)
  const mod = getExport(context)
  return testFn(mod)
}

export { runTestsOnSource }
