import { type Ref, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import type { Graph } from '@antv/x6'
import { initGraph, registerCustomNode } from './utils'

export function useFlow(elRef: Ref<HTMLElement | undefined>) {
  const graphRef = shallowRef<Graph>()

  registerCustomNode()

  onMounted(() => {
    graphRef.value = initGraph(elRef.value!)
  })

  onBeforeUnmount(() => {
    graphRef.value?.dispose()
  })
  return { graphRef }
}
