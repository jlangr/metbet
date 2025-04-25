import { parse } from '@babel/parser'
import traverseModule from '@babel/traverse'
const traverse = traverseModule.default

const complexityKeywords = [
  'IfStatement',
  'ConditionalExpression',
  'ForStatement',
  'WhileStatement',
  'DoWhileStatement',
  'SwitchCase',
  'LogicalExpression',
  'CatchClause',
  'BinaryExpression'
]

export const getCyclomaticComplexity = (source) =>
  computeComplexity(parseToAst(source))

const parseToAst = (code) =>
  parse(code, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript']
  })

const computeComplexity = (ast) =>
  1 + countComplexityNodes(ast)

const countComplexityNodes = (ast) => {
  let count = 0

  traverse(ast, {
    enter(path) {
      if (isComplexityContributingNode(path.node)) {
        count += complexityIncrement(path.node)
      }
    }
  })

  return count
}

const isComplexityContributingNode = (node) =>
  complexityKeywords.includes(node.type)

const complexityIncrement = (node) => {
  if (node.type === 'SwitchCase') return 1
  if (node.type === 'LogicalExpression') return 1
  if (node.type === 'ConditionalExpression') return 1
  if (node.type === 'CatchClause') return 1
  if (node.type === 'BinaryExpression') {
    if (['??', '&&', '||'].includes(node.operator)) return 1
    return 0
  }
  return 1
}
