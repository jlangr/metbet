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

  const accesses = {} // fnName → Set<state>
  const calls = {}    // fnName → Set<fnName>
  const nodes = new Set()

  traverse(ast, {
    FunctionDeclaration(path) {
      const name = path.node.id?.name
      if (!name) return

      const { accessed, called } = extractAccessAndCalls(path)
      accesses[name] = accessed
      calls[name] = called
      nodes.add(name)
    },

    VariableDeclarator(path) {
      const id = path.node.id
      const init = path.get('init')

      if (!t.isIdentifier(id)) return
      const name = id.name

      if (init.isFunctionExpression() || init.isArrowFunctionExpression()) {
        const { accessed, called } = extractAccessAndCalls(init)
        accesses[name] = accessed
        calls[name] = called
        nodes.add(name)
      }
    },

    ClassMethod(path) {
      const className = path.findParent(p => p.isClassDeclaration())?.node.id?.name
      const methodName = path.node.key.name
      if (methodName === 'constructor') return

      const name = `${className}#${methodName}`
      const { accessed, called } = extractAccessAndCalls(path)

      accesses[name] = accessed
      calls[name] = called
      nodes.add(name)
    }
  })

  // Expand transitive accesses via function calls
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

const extractAccessAndCalls = (fnPath) => {
  const accessed = new Set()
  const called = new Set()

  fnPath.traverse({
    MemberExpression(p) {
      if (t.isThisExpression(p.node.object) && t.isIdentifier(p.node.property)) {
        accessed.add(`this.${p.node.property.name}`)
      } else if (t.isIdentifier(p.node.object)) {
        accessed.add(p.node.object.name)
      }
    },
    Identifier(p) {
      if (
        !isLocalVariable(p) &&
        p.node.name !== 'undefined'
      ) {
        accessed.add(p.node.name)
      }
    },
    CallExpression(p) {
      const callee = p.node.callee
      if (t.isIdentifier(callee)) {
        called.add(callee.name)
      }
    }
  })

  return { accessed, called }
}

const isLocalVariable = (path) => {
  const binding = path.scope.getBinding(path.node.name)
  if (!binding) return false

  // Only consider it local if it's declared in the same function scope
  return path.scope === binding.scope
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
