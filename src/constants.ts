import type { LabelValue, NodeConfig } from './types'
import StartIcon from './components/icons/StartIcon.vue'
import NormalTranscodingIcon from './components/icons/NormalTranscodingIcon.vue'
import ScreenshotIcon from './components/icons/ScreenshotIcon.vue'

/** 自定义节点名 */
export const CUSTOM_NODE = 'custom-node'

export enum NODE_ENUM {
  '开始' = 'start',
  '普通转码' = 'normalTranscoding',
  '视频拼接' = 'videoSplicing',
  '截图' = 'screenshot',
  '输出' = 'output',
}

const startMenus: LabelValue[] = [
  { label: '普通转码', value: NODE_ENUM.普通转码 },
  { label: '视频拼接', value: NODE_ENUM.视频拼接 },
  { label: '截图', value: NODE_ENUM.截图 },
]

/** 节点配置 */
export const nodeConfig = {
  start: {
    title: '开始',
    icon: StartIcon,
    menus: [...startMenus],
  },
  normalTranscoding: {
    title: '普通转码',
    icon: NormalTranscodingIcon,
    menus: [
      ...startMenus,
      { label: '输出', value: NODE_ENUM.输出 },
    ],
  },
  screenshot: {
    title: '截图',
    icon: ScreenshotIcon,
    menus: [
      ...startMenus,
      { label: '输出', value: NODE_ENUM.输出 },
    ],
  },
  videoSplicing: {
    title: '视频拼接',
    icon: ScreenshotIcon,
    menus: [
      ...startMenus,
      { label: '输出', value: NODE_ENUM.输出 },
    ],
  },
  output: {
    title: '输出',
    icon: ScreenshotIcon,
    menus: [],
  },
} satisfies NodeConfig
