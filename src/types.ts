import type { VNode } from 'vue'

export interface LabelValue {
  label: string
  value: string
}

/** 自定义节点数据 */
export interface NodeItem {
  title: string
  icon: VNode
  menus: LabelValue[]
}
