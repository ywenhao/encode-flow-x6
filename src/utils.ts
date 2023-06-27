import type { Node } from '@antv/x6'
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import dagre from 'dagre'
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
export function addNode(graph: Graph, data?: Partial<NodeData>, id?: string) {
  const { type = 'start', status = 'normal', children = [], level = '1', isLeaf = true } = data || {}
  const node = graph.addNode({ id, shape: CUSTOM_NODE })
  const nodeId = node.id
  node.setData({ nodeId, type, status, children, level, isLeaf })
  layout(graph)
  return node
}

/** 添加开始节点 */
export function addStartNode(graph: Graph, id?: string) {
  return addNode(graph, { type: 'start' }, id)
}

/** 添加子节点 */
export function addChildNode(graph: Graph, node: Node, type: NodeType, id?: string) {
  const { children, level } = node.getData<NodeData>()

  const child = addNode(graph, { type, level: `${level}-${children.length + 1}` }, id)
  const data = node.getData<NodeData>()
  node.setData({ ...data, isLeaf: false, children: [...children, child.id] }, { overwrite: true })
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
  layout(graph)
}

/** 自动布局 */
export function layout(graph: Graph) {
  const nodes = graph.getNodes()
  const edges = graph.getEdges()
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', nodesep: GRID_SIZE * 2, ranksep: GRID_SIZE * 6, align: 'UL', marginx: -30, marginy: 20 })
  g.setDefaultEdgeLabel(() => ({}))

  const width = CUSTOM_NODE_WIDTH
  const height = CUSTOM_NODE_HEIGHT
  nodes.forEach((node) => {
    const { x, y } = node.getPosition()
    g.setNode(node.id, { width, height, x, y })
  })

  edges.forEach((edge) => {
    const source = edge.getSource() as { cell: string }
    const target = edge.getTarget() as { cell: string }
    g.setEdge(source.cell, target.cell)
  })

  dagre.layout(g)
  // 防止闪烁
  const edgesOpacity = edges.map((edge) => {
    const opacity = edge.getAttrByPath('line/opacity') || 1
    edge.setAttrByPath('line/opacity', 0)
    return opacity as number
  })

  g.nodes().forEach((id) => {
    const node = graph.getCellById(id) as Node
    if (node) {
      const pos = g.node(id)
      node.position(pos.x, pos.y)
    }
  })

  edges.forEach((edge, i) => {
    const source = edge.getSourceNode()!
    const target = edge.getTargetNode()!
    const sourceBBox = source.getBBox()
    const targetBBox = target.getBBox()
    if (sourceBBox.y !== targetBBox.y) {
      const gap = targetBBox.x - sourceBBox.x - sourceBBox.width
      const fix = sourceBBox.width
      const x = sourceBBox.x + fix + gap / 2
      edge.setVertices([
        { x, y: sourceBBox.center.y },
        { x, y: targetBBox.center.y },
      ])
    }
    else {
      edge.setVertices([])
    }
    edge.setAttrByPath('line/opacity', edgesOpacity[i])
  })
}

/** 获取level */
export function getLevel(node: Node) {
  const { level } = node.getData<NodeData>()
  return level.split('-').map(v => Number(v))
}

/** 计算child node位置 */
export function getChildNodePosition(node: Node, index: number) {
  let { x, y } = node.position()
  x = x + CUSTOM_NODE_WIDTH + GRID_SIZE * 6
  y = y + GRID_SIZE * 4 * index
  return { x, y }
}

/** 计算edge拐点 */
export function getEdgeVertices(source: Node, target: Node) {
  const fatherNode = source
  const childNode = target
  const fatherData = fatherNode.getData<NodeData>()
  if (fatherData.children.length <= 1)
    return []
  const { x, y } = fatherNode.position()
  const { x: childX, y: childY } = childNode.position()
  // 拐点
  const vertices = [
    { x: x + CUSTOM_NODE_WIDTH + GRID_SIZE * 3, y: y + CUSTOM_NODE_HEIGHT / 2 },
    { x: childX - GRID_SIZE * 3, y: childY + CUSTOM_NODE_HEIGHT / 2 },
  ]

  return vertices
}

/** 添加连线 */
export function addEdge(graph: Graph, source: Node, target: Node) {
  // const vertices = getEdgeVertices(source, target)
  const edge = graph.addEdge({
    source,
    target,
    // vertices,
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
  layout(graph)
  return edge
}

/** 选中节点 */
export function selectNode(node: Node) {
  store.selectNode = store.selectNode === node ? undefined : node
}
