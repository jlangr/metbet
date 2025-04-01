export const calculateDCOM4 = (graph) => {
  const visited = new Set()
  let count = 0

  const dfs = (node) => {
    visited.add(node)
    for (const neighbor of graph.edges[node]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor)
      }
    }
  }

  for (const node of graph.nodes) {
    if (!visited.has(node)) {
      dfs(node)
      count++
    }
  }

  return count === 0 ? 1 : count
}
