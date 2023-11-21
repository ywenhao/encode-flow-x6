import MenuNormalTranscodeIcon from './icons/menus/NormalTranscodeIcon.vue'
import MenuOutputIcon from './icons/menus/OutputIcon.vue'
import MenuScreenshotIcon from './icons/menus/ScreenshotIcon.vue'
import MenuVideoSpliceIcon from './icons/menus/VideoSpliceIcon.vue'
import NormalTranscodeIcon from './icons/NormalTranscodeIcon.vue'
import OutputIcon from './icons/OutputIcon.vue'
import ScreenshotIcon from './icons/ScreenshotIcon.vue'
import StartIcon from './icons/StartIcon.vue'
import VideoSpliceIcon from './icons/VideoSpliceIcon.vue'
import type { LabelValue, NodeConfig, NodeItem, NodeTypeKeys } from './types'

/** 自定义节点名 */
export const CUSTOM_NODE = 'custom-node'
/** 网格尺寸 */
export const GRID_SIZE = 20
/** 自定义节点宽 */
export const CUSTOM_NODE_WIDTH = 140
/** 自定义节点高 */
export const CUSTOM_NODE_HEIGHT = GRID_SIZE * 2

export enum NODE_ENUM {
  '开始' = 'start',
  '普通转码' = 'normalTranscode',
  '视频拼接' = 'videoSplice',
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
  normalTranscode: {
    title: '普通转码',
    icon: NormalTranscodeIcon,
    menus: [...startMenus, { label: '输出', value: NODE_ENUM.输出 }],
  },
  screenshot: {
    title: '截图',
    icon: ScreenshotIcon,
    menus: [{ label: '输出', value: NODE_ENUM.输出 }],
  },
  videoSplice: {
    title: '视频拼接',
    icon: VideoSpliceIcon,
    menus: [...startMenus, { label: '输出', value: NODE_ENUM.输出 }],
  },
  output: {
    title: '输出',
    icon: OutputIcon,
    menus: [],
  },
} satisfies NodeConfig

export const menusIcons = {
  normalTranscode: MenuNormalTranscodeIcon,
  screenshot: MenuScreenshotIcon,
  videoSplice: MenuVideoSpliceIcon,
  output: MenuOutputIcon,
} satisfies Record<NodeTypeKeys, NodeItem['icon']>
