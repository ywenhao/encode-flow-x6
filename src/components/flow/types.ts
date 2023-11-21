import type { NODE_ENUM } from './constants'
import type StartIcon from './icons/StartIcon.vue'

export interface LabelValue {
  label: string
  value: string
}

/** 自定义节点数据 */
export interface NodeItem {
  title: keyof typeof NODE_ENUM
  icon: typeof StartIcon
  menus: LabelValue[]
}

export type NodeType = `${NODE_ENUM}`

export type NodeTypeKeys = Exclude<NodeType, 'start'>

export type NodeConfig = {
  [T in NodeType]: NodeItem
}

export interface NodeData {
  nodeId: string
  type: NodeType
  level: string
  isLeaf: boolean
  status: 'success' | 'validate-error' | 'error' | 'normal'
  children: string[]
  tooltipMessage?: string
  verifyErrorMessage?: string
}

export type FromNodeData = Partial<Omit<NodeData, 'level' | 'isLeaf'>> &
Pick<NodeData, 'children' | 'nodeId'>

export type CustomNodeData = Omit<
  NodeData,
  'nodeId' | 'type' | 'level' | 'children' | 'isLeaf'
>

export type SetNodeData = Partial<CustomNodeData>
