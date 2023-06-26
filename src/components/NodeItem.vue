<script setup lang="ts">
import type { Graph, Node } from '@antv/x6'
import { Popover } from '@arco-design/web-vue'
import { type Ref, computed, inject, ref } from 'vue'
import type { LabelValue } from '@arco-design/web-vue/es/tree-select/interface'
import type { NodeData, NodeType } from '../types'
import { nodeConfig } from '../constants'
import { store } from '../store'
import { addChildNode, deleteNode, selectNode } from '../utils'
import CloseIcon from './icons/CloseIcon.vue'
import PlusIcon from './icons/PlusIcon.vue'
import SuccessIcon from './icons/SuccessIcon.vue'
import ErrorIcon from './icons/ErrorIcon.vue'

const popVisible = ref(false)

const getNode = inject('getNode') as () => Node
const getGraph = inject('getGraph') as () => Graph
const node = getNode()
const graph = getGraph()

const data = ref(node.getData() || {}) as Ref<NodeData>
const active = computed(() => store.selectNode ? (store.selectNode === node) : false)
const status = computed(() => data.value.status || 'default')

const config = nodeConfig[data.value.type]
const NormalIcon = config.icon

const menusVisible = computed(() => store.isEdit && config.menus.length)
const closeBtnVisible = computed(() => store.isEdit && data.value.type !== 'start')

node.on('change:data', ({ current }) => {
  data.value = current
})

function onPopClick(item: LabelValue) {
  const type = item.value as NodeType
  addChildNode(graph, node, type)
  popVisible.value = false
}

function handleDeleteNode() {
  deleteNode(graph, node)
}

function handleNodeClick() {
  // store.isEdit && selectNode(node)
  selectNode(node)
}
</script>

<template>
  <div class="node-box">
    <div class="node-item" :class="[status, { active }]" @click="handleNodeClick">
      <SuccessIcon v-if="status === 'success'" class="success-icon" />
      <ErrorIcon v-else-if="status === 'error'" class="error-icon" />
      <NormalIcon v-else class="normal-icon" />
      <div class="node-title">
        {{ config.title }}
      </div>
      <CloseIcon v-if="closeBtnVisible" class="close-icon" @click.stop="handleDeleteNode" />
    </div>
    <template v-if="menusVisible">
      <div class="line" />
      <Popover v-model:popup-visible="popVisible" position="bottom" content-class="node-popover-content">
        <PlusIcon class="plus-icon" />
        <template #content>
          <div class="menu">
            <div v-for="(item) in config.menus" :key="item.label" class="menu-item" @click="onPopClick(item)">
              {{ item.label }}
            </div>
          </div>
        </template>
      </Popover>
    </template>
  </div>
</template>

<style lang="less" scoped>
svg:focus-visible, svg:focus {
  outline: none;
}
.node-box {
  width: 100%;
  height: 100%;
  position: relative;
  .node-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px;
    border-radius: 30px;
    box-sizing: border-box;
    border: 1px solid;
    border-color: transparent;
    background-color: #fff;
    color: #1D2129;
    cursor: pointer;

    &.validate-error {
      border-color: #F53F3F;
    }
    &:hover, &.active {
      background-color: #F7F8FA;
    }
    &.success {
      color: #00B42A;
      border-color: #00B42A;
      &:hover, &.active {
        background-color: #E8FFEA;
      }
    }
    &.error {
      color: #F53F3F;
      border-color: #F53F3F;
      &:hover, &.active {
        background-color: #FFECE8;
      }
    }
  }

  .plus-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -41px;
    z-index: 10;
  }
  .line {
    z-index: -1;
    display: inline-block;
    width: 25px;
    height: 1px;
    background-color: #C9CDD4;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -25px;
  }

  .default-icon,
  .success-icon,
  .error-icon {
    width: 26px;
    height: 26px;
  }

  .close-icon {
    width: 16px;
    height: 16px;
  }

  .node-title {
    margin-left: 4px;
    margin-right: auto;
  }
}

.menu {
  padding: 2px 0;
}
.menu-item {
  cursor: pointer;
  padding: 8px;
  text-align: center;
}

.menu-item:hover {
  background: #f2fcff;
}

:global(.node-popover-content) {
  background: #fff;
  width: 100px;
  padding: 8px;
  padding-bottom: 12px;
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
