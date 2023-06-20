import type { Edge, Graph } from '@antv/x6'

export function addEdge(graph: Graph, source: Edge.TerminalData, target: Edge.TerminalData) {
  graph.addEdge({
    source,
    target,
    router: {
      name: 'er',
      args: {
        offset: 'center',
      },
    },
    connector: {
      name: 'rounded',
      args: {
        radius: 10,
      },
    },
    attrs: {
      line: {
        stroke: '#722ed1',
      },
    },
  })
}
