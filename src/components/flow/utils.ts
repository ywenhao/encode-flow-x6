import type { Node } from '@antv/x6'
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import dagre from 'dagre'
import { debounce } from 'lodash-es'

import {
  CUSTOM_NODE,
  CUSTOM_NODE_HEIGHT,
  CUSTOM_NODE_WIDTH,
  GRID_SIZE,
} from './constants'
import NodeItem from './NodeItem.vue'
import { store } from './store'
import type { FromNodeData, NodeData, NodeType } from './types'

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
  const {
    type = 'start',
    status = 'normal',
    children = [],
    level = '1',
    isLeaf = true,
    ...rest
  } = data || {}
  const node = graph.addNode({ id, shape: CUSTOM_NODE })
  const nodeId = node.id
  node.setData({ nodeId, type, status, children, level, isLeaf, ...rest })
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  layout(graph)
  return node
}

/** 添加开始节点 */
export function addStartNode(graph: Graph, id?: string) {
  return addNode(graph, { type: 'start' }, id)
}

/** 添加子节点 */
export function addChildNode(
  graph: Graph,
  fatherNode: Node,
  type: NodeType,
  nodeData?: Partial<NodeData>,
  id?: string,
) {
  const { children, level } = fatherNode.getData<NodeData>()
  const childLevel
    = (id && children.includes(id)) ? children.indexOf(id) + 1 : children.length + 1
  const child = addNode(
    graph,
    { type, level: `${level}-${childLevel}`, ...nodeData },
    id,
  )
  const data = fatherNode.getData<NodeData>()
  fatherNode.setData(
    { ...data, isLeaf: false, children: [...new Set([...children, child.id])] },
    { overwrite: true },
  )
  fatherNode.addChild(child)
  addEdge(graph, fatherNode, child)
  return child
}

/** 删除节点 */
export function deleteNode(graph: Graph, node: Node) {
  const { children } = node.getData<NodeData>()
  const nodes = graph.getNodes()
  // 查找父节点, 删除父节点的children中的当前nodeId
  const fatherNode = nodes.find(v =>
    v.getData<NodeData>().children.includes(node.id),
  )!
  const fatherChildren = fatherNode
    .getData<NodeData>()
    .children.filter(v => v !== node.id)
  const fatherData = fatherNode.getData<NodeData>()
  fatherNode.setData(
    { ...fatherData, children: fatherChildren, isLeaf: !fatherChildren.length },
    { overwrite: true },
  )
  // 设置兄弟节点的level
  const level = node.getData<NodeData>().level
  const levelArr = level.split('-').filter(Boolean).map(Number)
  const lastLevel = Number(levelArr[levelArr.length - 1])
  const idx = levelArr.length - 1
  nodes.forEach((node) => {
    const levels = node
      .getData<NodeData>()
      .level.split('-')
      .filter(Boolean)
      .map(Number)
    const l = levels[idx]
    if (levels.length >= levelArr.length && l > lastLevel) {
      const ls = levels.map((v, i) => (i === idx ? v - 1 : v))
      node.setData({ level: ls.join('-') })
    }
  })

  // 查找子节点
  const nodeIds = [node.id, ...children]
  const getNodeIds = (nodeIds: string[]) =>
    nodes
      .filter(v => nodeIds.includes(v.id))
      .map(v => v.getData<NodeData>().children)
      .flat()

  let ids = [...children]
  while (ids.length) {
    const ns = getNodeIds(ids)
    nodeIds.push(...ns)
    ids = [...ns]
  }
  // 删除连线
  const edges = graph.getEdges()
  const edgeIds = edges
    .filter(
      edge =>
        nodeIds.includes(edge.getSourceCellId())
        || nodeIds.includes(edge.getTargetCellId()),
    )
    .map(edge => edge.id)
  graph.removeCells([...nodeIds, ...edgeIds])
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  layout(graph)
}

/** 自动布局 */
export const layout = debounce(_layout, 0)

function _layout(graph: Graph) {
  const nodes = graph.getNodes()
  const edges = graph.getEdges()
  const g = new dagre.graphlib.Graph()
  g.setGraph({
    rankdir: 'LR',
    nodesep: GRID_SIZE * 2,
    ranksep: GRID_SIZE * 6,
    align: 'UL',
    marginx: -30,
    marginy: 20,
  })
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

/** 添加连线 */
export function addEdge(graph: Graph, source: Node, target: Node) {
  const edge = graph.addEdge({
    source,
    target,
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
        targetMarker: {
          // 箭头
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

export function formNodeData(graph: Graph, data: FromNodeData[]) {
  const startData = data.find(v => v.type === 'start')
  if (!startData)
    throw new Error('Can\'t find start data')
  const startNode = addNode(graph, startData, startData.nodeId)
  const add = (fatherId: string) => {
    const fatherNode = graph.getCellById(fatherId) as Node
    const fatherData = fatherNode.getData<NodeData>()
    const children = [...fatherData.children]
    children.forEach((childId) => {
      const childData = data.find(v => v.nodeId === childId)!
      addChildNode(
        graph,
        fatherNode,
        childData.type as NodeType,
        childData,
        childId,
      )
      childData.children.length && add(childId)
    })
  }
  add(startNode.id)
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
