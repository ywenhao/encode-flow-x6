<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useFlow } from './useFlow'
import { store } from './store'
import { addStartNode } from './utils'
import type { NodeData } from './types'

const containerRef = ref<HTMLDivElement>()
const { graphRef } = useFlow(containerRef)

store.isEdit = true

onMounted(() => {
  addStartNode(graphRef.value!)
})

watch(
  () => store.selectNode,
  (node) => {
    const json = graphRef.value!.toJSON()
    const str = JSON.stringify(json)
    console.warn(str)
    const data = node!.getData<NodeData>()
    setTimeout(() => {
      graphRef.value?.clearCells()
      setTimeout(() => {
        graphRef.value?.fromJSON(JSON.parse(str))
      }, 1000)
    }, 1000)
    console.warn('selectNode-data', data)
  },
)
</script>

<template>
  <div class="app-content">
    <div ref="containerRef" />
  </div>
</template>

<style lang="less">
.app-content {
  width: 100%;
  height: 100%;
  * {
    box-sizing: border-box;
  }
}
</style>
