<script setup lang="ts">
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import { onMounted, ref, shallowRef } from 'vue'
import NodeItem from './components/NodeItem.vue'

const flowRef = ref<HTMLDivElement>()

const graphRef = shallowRef<Graph>()

register({
  shape: 'custom-vue-node',
  width: 120,
  height: 40,
  component: NodeItem,
  data: {
    color: 'red',
  },
})

function initGraph() {
  graphRef.value = new Graph({
    container: flowRef.value!,
    background: {
      color: '#F2F7FA',
    },
    interacting: false,
    autoResize: true,
  })

  graphRef.value.addNode({
    shape: 'custom-vue-node',
    x: 100,
    y: 60,
  })
}

onMounted(() => {
  initGraph()
})

setTimeout(() => {
  getNode().setData({
    color: 'blue',
  })
}, 1000)

function getNode() {
  return graphRef.value!.getNodes()[0]
}
</script>

<template>
  <div class="app-content">
    <div ref="flowRef" />
    <!-- <TeleportContainer /> -->
  </div>
</template>

<style scoped>
.app-content {
  width: 100%;
  height: 100%;
}
</style>
