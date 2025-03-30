import { parse } from '@babel/parser'
import traverseLib from '@babel/traverse'
import * as t from '@babel/types'

const traverse = traverseLib.default

const parseOptions = {
  sourceType: 'module',
  plugins: ['classProperties']
}

const extractFunctions = (ast) => {
  const functions = []
  const accesses = {}

  traverse(ast, {
    FunctionDeclaration(path) {
      functions.push(path.node.id.name)
    },
    VariableDeclarator(path) {
      if (t.isFunctionExpression(path.node.init) || t.isArrowFunctionExpression(path.node.init)) {
        functions.push(path.node.id.name)
      }
    },
    ClassMethod(path) {
      const className = path.findParent(p => p.isClassDeclaration())?.node.id.name
      const name = `${className}#${path.node.key.name}`
      functions.push(name)
    }
  })

  traverse(ast, {
    enter(path) {
      if (
        path.isFunctionDeclaration() ||
        path.isFunctionExpression() ||
        path.isArrowFunctionExpression() ||
        path.isClassMethod()
      ) {
        const fnName = getFunctionName(path)
        if (!fnName) return

        const localVars = new Set()
        path.traverse({
          VariableDeclarator(p) {
            if (t.isIdentifier(p.node.id)) {
              localVars.add(p.node.id.name)
            }
          },
          MemberExpression(p) {
            if (
              t.isThisExpression(p.node.object) &&
              t.isIdentifier(p.node.property)
            ) {
              const field = `this.${p.node.property.name}`
              if (!accesses[fnName]) accesses[fnName] = new Set()
              accesses[fnName].add(field)
            }
            if (
              t.isIdentifier(p.node.object) &&
              !localVars.has(p.node.object.name)
            ) {
              const varName = p.node.object.name
              if (!accesses[fnName]) accesses[fnName] = new Set()
              accesses[fnName].add(varName)
            }
          },
          Identifier(p) {
            if (
              t.isReferenced(p.node, p.parent) &&
              !localVars.has(p.node.name) &&
              p.node.name !== 'undefined'
            ) {
              const varName = p.node.name
              if (!accesses[fnName]) accesses[fnName] = new Set()
              accesses[fnName].add(varName)
            }
          }
        })
      }
    }
  })

  return { functions, accesses }
}

const getFunctionName = (path) => {
  if (t.isFunctionDeclaration(path.node)) return path.node.id?.name
  if (t.isClassMethod(path.node)) {
    const className = path.findParent(p => p.isClassDeclaration())?.node.id.name
    return className ? `${className}#${path.node.key.name}` : null
  }
  const parent = path.findParent(p => t.isVariableDeclarator(p.node))
  return parent?.node.id?.name ?? null
}

const buildGraph = (functions, accesses) => {
  const edges = {}
  const stateful = functions.filter(fn => accesses[fn] && accesses[fn].size > 0)

  for (const fn of stateful) edges[fn] = new Set()

  for (let i = 0; i < stateful.length; i++) {
    for (let j = i + 1; j < stateful.length; j++) {
      const a = stateful[i]
      const b = stateful[j]
      const shared = [...accesses[a]].some(x => accesses[b].has(x))
      if (shared) {
        edges[a].add(b)
        edges[b].add(a)
      }
    }
  }

  return { nodes: stateful, edges }
}

const countComponents = (graph) => {
  const visited = new Set()
  let components = 0

  const dfs = (node) => {
    visited.add(node)
    for (const neighbor of graph.edges[node]) {
      if (!visited.has(neighbor)) dfs(neighbor)
    }
  }

  for (const node of graph.nodes) {
    if (!visited.has(node)) {
      components++
      dfs(node)
    }
  }

  return components === 0 ? 1 : components
}

export const calculateDCOM4 = (code) => {
  const ast = parse(code, parseOptions)
  const { functions, accesses } = extractFunctions(ast)
  const graph = buildGraph(functions, accesses)
  return countComponents(graph)
}
