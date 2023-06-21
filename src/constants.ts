import type { NodeItem } from './types'
import StartIcon from './components/icons/StartIcon.vue'
import NormalTranscodingIcon from './components/icons/NormalTranscodingIcon.vue'
import ScreenshotIcon from './components/icons/ScreenshotIcon.vue'

/** 自定义节点名 */
export const CUSTOM_NODE = 'custom-node'

export enum NODE_ENUM {
  '开始' = 'start',
  '普通转码' = 'normal-transcoding',
  '视频拼接' = 'video-splicing',
  '截图' = 'screenshot',
  '输出' = 'output',
}

export const NodeClass = {
  'start': {
    title: '开始',
    icon: StartIcon,
    menus: [
      { label: '普通转码', value: NODE_ENUM.普通转码 },
      { label: '视频拼接', value: NODE_ENUM.视频拼接 },
      { label: '截图', value: NODE_ENUM.截图 },
    ],
  },
  'normal-transcoding': {
    title: '普通转码',
    icon: NormalTranscodingIcon,
    menus: [
      { label: '普通转码', value: NODE_ENUM.普通转码 },
      { label: '视频拼接', value: NODE_ENUM.视频拼接 },
      { label: '截图', value: NODE_ENUM.截图 },
      { label: '输出', value: NODE_ENUM.输出 },
    ],
  },
  'screenshot': {
    title: '截图',
    icon: ScreenshotIcon,
    menus: [
      { label: '普通转码', value: NODE_ENUM.普通转码 },
      { label: '视频拼接', value: NODE_ENUM.视频拼接 },
      { label: '截图', value: NODE_ENUM.截图 },
      { label: '输出', value: NODE_ENUM.输出 },
    ],
  },
  'video-splicing': {
    title: '视频拼接',
    icon: ScreenshotIcon,
    menus: [
      { label: '普通转码', value: NODE_ENUM.普通转码 },
      { label: '视频拼接', value: NODE_ENUM.视频拼接 },
      { label: '截图', value: NODE_ENUM.截图 },
      { label: '输出', value: NODE_ENUM.输出 },
    ],
  },
  'output': {
    title: '输出',
    icon: ScreenshotIcon,
    menus: [],
  },
} as const satisfies Record<`${NODE_ENUM}`, NodeItem>
