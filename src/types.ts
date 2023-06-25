import type StartIcon from './components/icons/StartIcon.vue'
import type { NODE_ENUM } from './constants'

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

export type NodeKey = `${NODE_ENUM}`

export type NodeConfig = {
  [T in NodeKey]: NodeItem
}

export interface NodeData {
  type: NodeKey
  status: 'success' | 'validate-error' | 'error' | 'normal'
  active: boolean
}
