<script setup lang="ts">
import { ref } from 'vue'
import { useFlow } from './useFlow'
import { CUSTOM_NODE } from './constants'

const containerRef = ref<HTMLDivElement>()
const { graphRef } = useFlow(containerRef)

setTimeout(() => {
  graphRef.value?.addNode({
    shape: CUSTOM_NODE,
    x: 100,
    y: 100,
  })
}, 1000)
</script>

<template>
  <div class="app-content">
    <div ref="containerRef" />
  </div>
</template>

<style scoped>
.app-content {
  width: 100%;
  height: 100%;
}
</style>
