import type { Graph } from '@antv/x6'
import { debounce } from 'lodash-es'
import { type Ref, onBeforeUnmount, onMounted, shallowRef } from 'vue'

import { useResizeObserver } from '@vueuse/core'
import { CUSTOM_NODE_WIDTH, GRID_SIZE } from './constants'
import type { NodeData } from './types'
import { initGraph, registerCustomNode } from './utils'

export function useFlow(
  elRef: Ref<HTMLElement | undefined>,
  boxRef: Ref<HTMLElement | undefined>,
) {
  const graphRef = shallowRef<Graph>()

  registerCustomNode()

  let boxWidth = 0

  onMounted(() => {
    graphRef.value = initGraph(elRef.value!)
    onResize(graphRef.value!, boxRef.value!)
    boxWidth = boxRef.value!.clientWidth
  })

  useResizeObserver(boxRef, () => {
    if (boxWidth === boxRef.value!.clientWidth)
      return
    boxWidth = boxRef.value!.clientWidth

    graphRef.value
      && boxRef.value
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      && handleResize(graphRef.value!, boxRef.value!)
  })

  onBeforeUnmount(() => {
    graphRef.value?.dispose()
  })

  const getData = () =>
    graphRef.value!.getNodes().map(v => v.getData<NodeData>())
  return { graphRef, getData }
}

function onHeight(graph: Graph) {
  const yArr = graph.getNodes().map(v => v.getPosition().y)
  const maxY = Math.max(...yArr)
  const height = 4 * GRID_SIZE + maxY
  height > 0 && graph.resize(undefined, height)
}

function onWidth(graph: Graph, boxRef: HTMLElement) {
  const xArr = graph.getNodes().map(v => v.getPosition().x)
  const maxX = Math.max(...xArr)
  const w = CUSTOM_NODE_WIDTH + GRID_SIZE * 4 + maxX
  if (w < 0)
    return
  const scrollWidth = boxRef.scrollWidth
  if (scrollWidth === w)
    return
  const rect = boxRef.getBoundingClientRect()
  graph.resize(w > rect.width ? w : rect.width)
  boxRef.style.overflowX = w > rect.width ? 'auto' : 'initial'
}

const handleResize = debounce((graph: Graph, boxRef: HTMLElement) => {
  onHeight(graph)
  onWidth(graph, boxRef)
}, 100)

function onResize(graph: Graph, boxRef: HTMLElement) {
  graph.on('node:removed', () => handleResize(graph, boxRef))
  graph.on('node:added', () => handleResize(graph, boxRef))
}
