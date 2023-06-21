import { type Edge, Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import NodeItem from './components/NodeItem.vue'
import { CUSTOM_NODE } from './constants'

/** 初始化 */
export function initGraph(el: HTMLElement) {
  const graph = new Graph({
    container: el,
    autoResize: true,
    interacting: false,
    grid: {
      size: 20,
      visible: true,
      type: 'mesh',
      args: {
        color: '#E5E6EB', // 网格线/点颜色
        thickness: 1, // 网格线宽度/网格点大小
      },
    },
    background: { color: '#F2F3F5' },
  })
  return graph
}

/** 添加连线 */
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

/** 注册自定义node */
export function registerCustomNode() {
  register({
    shape: CUSTOM_NODE,
    width: 140,
    height: 40,
    component: NodeItem,
  })
}

/** 添加节点 */
export function addNode(graph: Graph, x: number, y: number) {
  return graph.addNode({
    shape: CUSTOM_NODE,
    x,
    y,
  })
}
