import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import chalk from 'chalk';

const parseSource = (source) =>
  parse(source, {
    ecmaVersion: 'latest',
    locations: true,
    sourceType: 'module'
  });

const calculateCyclomaticComplexity = (node) => {
  let complexity = 1; // Start with 1 for the default path

  walk.simple(node.body, {
    IfStatement: () => complexity++,
    ForStatement: () => complexity++,
    WhileStatement: () => complexity++,
    DoWhileStatement: () => complexity++,
    SwitchCase: (n) => {
      if (n.test) complexity++;
    },
    ConditionalExpression: () => complexity++,
    LogicalExpression: (n) => {
      if (['&&', '||'].includes(n.operator)) complexity++;
    },
    CatchClause: () => complexity++
  });

  return complexity;
};

const detectMutation = (node) => {
  let hasMutation = false;

  walk.simple(node.body, {
    AssignmentExpression: () => hasMutation = true,
    UpdateExpression: () => hasMutation = true,
    CallExpression: (n) => {
      const name = n.callee.name || '';
      if (/set|write|update|mutate/i.test(name)) hasMutation = true;
    }
  });

  return hasMutation;
};

const analyzeFunction = (node) => {
  const loc = node.loc.end.line - node.loc.start.line + 1;
  const paramCount = node.params.length;
  const complexity = calculateCyclomaticComplexity(node);
  const hasMutation = detectMutation(node);
  const purity = hasMutation ? 0 : 1;

  return {
    loc,
    paramCount,
    complexity,
    purity
  };
};

export const normalize = (val, max) => Math.min(1, 1 - val / max);

const scoreFunction = ({ loc, paramCount, complexity, purity }) => {
  const locScore = normalize(loc, 50);
  const paramScore = normalize(paramCount, 5);
  const complexityScore = normalize(complexity, 10);
  const purityScore = purity;

  return (locScore + paramScore + complexityScore + purityScore) / 4;
};

export const analyzeModule = (sourceCode) => {
  const ast = parseSource(sourceCode);
  const functions = [];

  walk.simple(ast, {
    FunctionDeclaration(node) {
      if (node.body) functions.push(node);
    },
    FunctionExpression(node) {
      if (node.body) functions.push(node);
    },
    ArrowFunctionExpression(node) {
      if (node.body?.type === 'BlockStatement') functions.push(node);
    }
  });

  const results = functions.map((node) => {
    const metrics = analyzeFunction(node);
    return {
      ...metrics,
      score: scoreFunction(metrics)
    };
  });

  const moduleScore = results.length
    ? +(results.reduce((sum, fn) => sum + fn.score, 0) / results.length * 100).toFixed(1)
    : 0;

  return {
    moduleScore,
    functions: results
  };
};

export const printReport = (path, result) => {
  console.log(chalk.blueBright(`\n📦 Module: ${path}`));
  console.log(chalk.green(`✔ SRP Compliance Score: ${result.moduleScore}%`));
  console.table(result.functions.map(f => ({
    LOC: f.loc,
    Params: f.paramCount,
    Complexity: f.complexity,
    Purity: f.purity,
    Score: +(f.score * 100).toFixed(1)
  })));
};
