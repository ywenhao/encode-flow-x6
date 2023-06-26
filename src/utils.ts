import type { Edge, Node } from '@antv/x6'
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import NodeItem from './components/NodeItem.vue'
import { CUSTOM_NODE, CUSTOM_NODE_HEIGHT, CUSTOM_NODE_WIDTH, GRID_SIZE } from './constants'
import type { NodeData, NodeType } from './types'
import { store } from './store'

/** 初始化 */
export function initGraph(el: HTMLElement) {
  const graph = new Graph({
    container: el,
    autoResize: true,
    interacting: false,
    connecting: {
      sourceAnchor: 'right',
      targetAnchor: 'left',
    },
    grid: {
      size: GRID_SIZE,
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
    width: CUSTOM_NODE_WIDTH,
    height: CUSTOM_NODE_HEIGHT,
    component: NodeItem,
  })
}

/** 添加节点 */
export function addNode(graph: Graph, x: number, y: number, data?: Partial<NodeData>, id?: string) {
  const { type = 'start', status = 'normal', children = [], level = 0 } = data || {}
  const node = graph.addNode({ id, x, y, shape: CUSTOM_NODE })
  const nodeId = node.id
  node.setData({ nodeId, type, status, children, level })
  return node
}

/** 添加开始节点 */
export function addStartNode(graph: Graph, id?: string) {
  return addNode(graph, GRID_SIZE * 2, GRID_SIZE * 2, { type: 'start' }, id)
}

/** 添加子节点 */
export function addChildNode(graph: Graph, node: Node, type: NodeType, id?: string) {
  let { x, y } = node.position()
  const { children, level } = node.getData<NodeData>()
  x = x + CUSTOM_NODE_WIDTH + GRID_SIZE * 6
  y = y + GRID_SIZE * 4 * children.length

  const child = addNode(graph, x, y, { type, level: level + 1 }, id)
  const data = node.getData<NodeData>()
  node.setData({ ...data, children: [...children, child.id] }, { overwrite: true })
  addEdge(graph, node, child)
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
  // 删除的是叶子节点不重置位置
  children.length && resetPosition(graph)
}

/** 重置位置 */
export function resetPosition(graph: Graph) {
  const nodes = graph.getNodes()
  const edges = graph.getEdges()
  // 防止闪烁
  edges.forEach(edge => edge.setAttrByPath('line/opacity', 0))
  const startNode = nodes.find(v => v.getData<NodeData>().type === 'start')
  if (!startNode)
    throw new Error('未找到开始节点')

  // 重置节点位置
  const resetNodePosition = (node: Node) => {
    const children = node.getData<NodeData>().children
    const childNodes = nodes.filter(v => children.includes(v.id))
    const { x, y } = node.position()
    childNodes.forEach((child, index) => {
      child.setPosition(x + CUSTOM_NODE_WIDTH + GRID_SIZE * 6, y + GRID_SIZE * 4 * index)
      resetNodePosition(child)
    })
  }
  resetNodePosition(startNode)
  // 重置连线位置
  const resetEdgePosition = (edge: Edge) => {
    const source = edge.getSourceNode()
    const target = edge.getTargetNode()
    const { x, y } = source!.position()
    const { x: childX, y: childY } = target!.position()
    // 拐点
    const vertices = source!.getData<NodeData>().children.length > 1
      ? [
          { x: x + CUSTOM_NODE_WIDTH + GRID_SIZE * 3, y: y + CUSTOM_NODE_HEIGHT / 2 },
          { x: childX - GRID_SIZE * 3, y: childY + CUSTOM_NODE_HEIGHT / 2 },
        ]
      : []
    edge.setVertices(vertices)
  }

  edges.forEach((edge) => {
    resetEdgePosition(edge)
    edge.setAttrByPath('line/opacity', 1)
  })
}

/** 添加连线 */
export function addEdge(graph: Graph, source: Node, target: Node) {
  const fatherNode = source
  const childNode = target
  const fatherData = fatherNode.getData<NodeData>()
  const { x, y } = fatherNode.position()
  const { x: childX, y: childY } = childNode.position()
  // 拐点
  const vertices = fatherData.children.length > 1
    ? [
        { x: x + CUSTOM_NODE_WIDTH + GRID_SIZE * 3, y: y + CUSTOM_NODE_HEIGHT / 2 },
        { x: childX - GRID_SIZE * 3, y: childY + CUSTOM_NODE_HEIGHT / 2 },
      ]
    : undefined

  return graph.addEdge({
    source,
    target,
    vertices,
    router: {
      name: 'normal',
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
