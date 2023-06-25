import type { Edge, Node } from '@antv/x6'
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import NodeItem from './components/NodeItem.vue'
import { CUSTOM_NODE } from './constants'
import type { NodeData, NodeType } from './types'
import { store } from './store'

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
export function addNode(graph: Graph, x: number, y: number, data?: Partial<NodeData>) {
  const { type = 'start', status = 'normal', active = false, children = [] } = data || {}
  const node = graph.addNode({
    shape: CUSTOM_NODE, x, y,
  })

  const nodeId = node.id
  node.setData({ nodeId, type, status, active, children })
  return node
}

/** 添加开始节点 */
export function addStartNode(graph: Graph) {
  return addNode(graph, 40, 40, { type: 'start' })
}

/** 添加子节点 */
export function addChildNode(graph: Graph, node: Node, type: NodeType) {
  let { x, y } = node.position()
  const children = node.getData<NodeData>().children || []
  x = x + 260
  y = y + 80 * children.length

  const child = addNode(graph, x, y, { type })
  const data = node.getData<NodeData>()
  node.setData({ ...data, children: [...children, child.id] }, { overwrite: true })
  addEdge(graph, { cell: node, port: 'out' }, { cell: child, port: 'in' })
  return child
}

/** 删除节点 */
export function deleteNode(graph: Graph, node: Node) {
  const { children } = node.getData<NodeData>()
  const nodes = graph.getNodes()
  // 查找父节点, 删除父节点的children中的当前nodeId
  const fatherNode = nodes.find(v => v.getData<NodeData>().children.includes(node.id))!
  const fatherChildren = fatherNode.getData<NodeData>().children
  const fatherData = fatherNode.getData<NodeData>()
  fatherNode.setData({ ...fatherData, children: fatherChildren.filter(v => v !== node.id) }, { overwrite: true })
  // 查找子节点
  const nodeIds = [node.id, ...children]
  const getNodeIds = (nodeIds: string[]) => nodes.filter(v => nodeIds.includes(v.id)).map(v => v.getData<NodeData>().children).flat()

  let ids = [...children]
  while (ids.length) {
    const ns = getNodeIds(ids)
    nodeIds.push(...ns)
    ids = [...ns]
  }
  // 删除连线
  const edges = graph.getEdges()
  const edgeIds = edges.filter(edge => nodeIds.includes(edge.getSourceCellId()) || nodeIds.includes(edge.getTargetCellId())).map(edge => edge.id)
  graph.removeCells([...nodeIds, ...edgeIds])
  resetPosition(graph)
}

/** 重置位置 */
export function resetPosition(graph: Graph) {
  // TODO: 重置位置
  console.log('resetPosition')
}

/** 添加连线 */
export function addEdge(graph: Graph, source: Edge.TerminalData, target: Edge.TerminalData) {
  // TODO: 添加连线, 拐点
  return graph.addEdge({
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
    zIndex: 0,
    attrs: {
      line: {
        stroke: '#C9CDD4',
        strokeWidth: 1,
        targetMarker: { // 箭头
          name: 'block',
          size: 6,
        },
      },
    },
  })
}

/** 选中节点 */
export function selectNode(node: Node) {
  store.selectNode = store.selectNode === node ? undefined : node
}
