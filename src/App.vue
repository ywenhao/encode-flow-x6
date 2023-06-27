<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useFlow } from './useFlow'
import { store } from './store'
import { addStartNode } from './utils'

const containerRef = ref<HTMLDivElement>()
const { graphRef } = useFlow(containerRef)

store.isEdit = true

onMounted(() => {
  addStartNode(graphRef.value!)
})

watch(
  () => store.selectNode,
  (node) => {
    console.log('selectNode', node)
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
