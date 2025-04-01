import { parse } from '@babel/parser'
import traverseLib from '@babel/traverse'
import * as t from '@babel/types'

const traverse = traverseLib.default

const parseOptions = {
  sourceType: 'module',
  plugins: ['classProperties']
}

export const extractGraphFromCode = (code) => {
  const ast = parse(code, parseOptions)

  const accesses = {}    // function -> Set of state accesses
  const calls = {}       // function -> Set of called function names
  const nodes = new Set()

  let currentFunction = null

  traverse(ast, {
    enter(path) {
      if (
        path.isFunctionDeclaration() ||
        path.isFunctionExpression() ||
        path.isArrowFunctionExpression() ||
        path.isClassMethod()
      ) {
        const name = getFunctionName(path)
        if (!name) return

        currentFunction = name
        accesses[currentFunction] = new Set()
        calls[currentFunction] = new Set()
        nodes.add(currentFunction)
      }

      // Collect accesses inside current function
      if (currentFunction) {
        if (path.isMemberExpression()) {
          if (t.isThisExpression(path.node.object) && t.isIdentifier(path.node.property)) {
            accesses[currentFunction].add(`this.${path.node.property.name}`)
          } else if (t.isIdentifier(path.node.object)) {
            accesses[currentFunction].add(path.node.object.name)
          }
        }

        if (path.isIdentifier()) {
          if (
            !isLocalVariable(path) &&
            path.node.name !== 'undefined'
          ) {
            accesses[currentFunction].add(path.node.name)
          }
        }

        if (path.isCallExpression()) {
          const callee = path.node.callee
          if (t.isIdentifier(callee)) {
            calls[currentFunction].add(callee.name)
          }
        }
      }
    },

    exit(path) {
      if (
        path.isFunctionDeclaration() ||
        path.isFunctionExpression() ||
        path.isArrowFunctionExpression() ||
        path.isClassMethod()
      ) {
        currentFunction = null
      }
    }
  })

  // Propagate transitive accesses via call graph
  const resolvedAccesses = {}
  for (const fn of nodes) {
    resolvedAccesses[fn] = new Set(accesses[fn] || [])

    const seen = new Set()
    const stack = [...(calls[fn] || [])]

    while (stack.length > 0) {
      const target = stack.pop()
      if (!target || seen.has(target)) continue
      seen.add(target)

      if (accesses[target]) {
        for (const a of accesses[target]) {
          resolvedAccesses[fn].add(a)
        }
      }

      if (calls[target]) {
        stack.push(...calls[target])
      }
    }
  }

  // Filter out pure functions
  const filteredNodes = [...nodes].filter(fn => resolvedAccesses[fn] && resolvedAccesses[fn].size > 0)

  const edges = {}
  for (const fn of filteredNodes) edges[fn] = new Set()

  for (let i = 0; i < filteredNodes.length; i++) {
    for (let j = i + 1; j < filteredNodes.length; j++) {
      const a = filteredNodes[i]
      const b = filteredNodes[j]
      const shared = [...resolvedAccesses[a]].some(x => resolvedAccesses[b].has(x))
      if (shared) {
        edges[a].add(b)
        edges[b].add(a)
      }
    }
  }

  return { nodes: filteredNodes, edges }
}

const getFunctionName = (path) => {
  if (t.isFunctionDeclaration(path.node)) {
    return path.node.id?.name
  }

  if (t.isClassMethod(path.node)) {
    const className = path.findParent(p => p.isClassDeclaration())?.node.id?.name
    const methodName = path.node.key.name
    if (methodName === 'constructor') return null
    return className && methodName ? `${className}#${methodName}` : null
  }

  const declarator = path.findParent(p => t.isVariableDeclarator())
  if (declarator && t.isIdentifier(declarator.node.id)) {
    return declarator.node.id.name
  }

  return null
}

const isLocalVariable = (path) => {
  const binding = path.scope.getBinding(path.node.name)
  if (!binding) return false

  return path.scope === binding.scope
}
// const isLocalVariable = (path) => {
//   const binding = path.scope.getBinding(path.node.name)
//   if (!binding) return false
//
//   return binding.scope.block.type === 'FunctionDeclaration' ||
//     binding.scope.block.type === 'FunctionExpression' ||
//     binding.scope.block.type === 'ArrowFunctionExpression'
// }
