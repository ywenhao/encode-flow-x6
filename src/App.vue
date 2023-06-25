<script setup lang="ts">
import { ref } from 'vue'
import { useFlow } from './useFlow'
import { CUSTOM_NODE } from './constants'
import type { NodeData } from './types'
import { store } from './store'

const containerRef = ref<HTMLDivElement>()
const { graphRef } = useFlow(containerRef)

setTimeout(() => {
  graphRef.value?.addNode({
    shape: CUSTOM_NODE,
    x: 40,
    y: 40,
    data: {
      type: 'start',
      status: 'normal',
      active: false,
    } satisfies NodeData,
  })
}, 1000)
store.isEdit = true
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
