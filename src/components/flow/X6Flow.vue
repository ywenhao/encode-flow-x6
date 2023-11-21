<script setup lang="ts">
import { nextTick, onMounted, ref, watch, watchEffect } from 'vue'

import { store } from './store'
import type { FromNodeData, NodeData, SetNodeData } from './types'
import { useFlow } from './useFlow'
import { addStartNode, formNodeData } from './utils'

const props = withDefaults(
  defineProps<{
    // 是否添加模式
    addStart?: boolean
    // 开启编辑模式
    edit?: boolean
    maxCount?: number
  }>(),
  { maxCount: 50 },
)

const emit = defineEmits<{
  'node-click': [data: NodeData]
  add: [data: NodeData]
  delete: [data: NodeData]
}>()

const flowRef = ref<HTMLDivElement>()
const boxRef = ref<HTMLDivElement>()
const { graphRef, getData } = useFlow(flowRef, boxRef)

watchEffect(() => {
  store.edit = props.edit
  store.maxCount = props.maxCount
})

onMounted(() => {
  props.edit && addListener()
})

const unwatch = watch([() => props.addStart, graphRef], ([addStart, graph]) => {
  if (addStart && graph) {
    addStartNode(graphRef.value!)
    unwatch()
  }
})

function addListener() {
  graphRef.value!.on('node:added', async ({ node }) => {
    await nextTick()
    const data = node?.getData<NodeData>()!
    emit('add', data)
  })

  graphRef.value!.on('node:removed', ({ node }) => {
    const data = node?.getData<NodeData>()!
    emit('delete', data)
  })
}

watch(
  () => store.selectNode,
  (node) => {
    if (!node)
      return
    const data = node?.getData<NodeData>()!
    emit('node-click', data)
  },
)

function clearActive() {
  store.selectNode = undefined
}

function setNodeData(nodeId: string, data: SetNodeData) {
  if (!nodeId)
    throw new Error('nodeId can\'t be empty')
  graphRef.value?.getCellById(nodeId)!.setData(data)
}

function fromData(data: FromNodeData[]) {
  graphRef.value!.clearCells()
  formNodeData(graphRef.value!, data)
}

defineExpose({ getData, clearActive, setNodeData, fromData })
</script>

<template>
  <div ref="boxRef" class="x6-scrollbar-box">
    <div class="scrollbar-warp">
      <div ref="flowRef" class="x6-box" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.x6-scrollbar-box {
  width: 100%;
}
.x6-box {
  min-height: 120px;
}
</style>
