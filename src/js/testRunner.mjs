import vm from 'node:vm'
import assert from 'node:assert'

const createContext = () =>
  vm.createContext({ exports: {}, module: { exports: {} }, assert })

const evaluate = (source, context) =>
  vm.runInContext(source, context)

const extractExport = context =>
  context.module.exports || context.exports

const runIsolatedTest = (productionSource, testSource, functionName) => {
  const context = createContext()
  evaluate(productionSource, context)
  context[functionName] = extractExport(context)
  evaluate(testSource, context)
}

export { runIsolatedTest }
