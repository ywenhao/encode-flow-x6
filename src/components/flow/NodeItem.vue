<script setup lang="ts">
import type { Graph, Node } from '@antv/x6'
import { Message, Popover } from '@arco-design/web-vue'
import { type Ref, computed, inject, ref } from 'vue'

import { menusIcons, nodeConfig } from './constants'
import PlusIcon from './icons/PlusIcon.vue'
import NodeItem2 from './NodeItem2.vue'
import { store } from './store'
import type { LabelValue, NodeData, NodeType, NodeTypeKeys } from './types'
import { addChildNode, deleteNode, selectNode } from './utils'

const popVisible = ref(false)

const getNode = inject('getNode') as () => Node
const getGraph = inject('getGraph') as () => Graph
const node = getNode()
const graph = getGraph()

const data = ref(node.getData() || {}) as Ref<NodeData>
const active = computed(() =>
  store.selectNode ? store.selectNode === node : false,
)
const status = computed(() => data.value.status || 'normal')
const type = computed(() => data.value.type)
const verifyErrorMessage = computed(() => data.value.verifyErrorMessage)
const tooltipMessage = computed(() => data.value.tooltipMessage)

const config = nodeConfig[type.value]

const hasMenus = computed(() => store.edit && !!config.menus.length)
const closeBtnVisible = computed(() => store.edit && type.value !== 'start')

function getIcon(value: NodeTypeKeys) {
  return menusIcons[value]
}

node.on('change:data', ({ current }) => {
  data.value = current
})

function handlePopClick(item: LabelValue) {
  const nodes = graph.getNodes()
  const nodeCount = nodes.length
  // 开始节点不算在内
  if (nodeCount - 1 >= store.maxCount) {
    Message.error('已达到转码节点上限')
    return
  }
  const type = item.value as NodeType

  // 如果已经有输出节点了，就不能再添加输出节点
  if (type === 'output') {
    const hasOutput = data.value.children
      .map(id => nodes.find(n => n.id === id)!.getData<NodeData>().type)
      .includes('output')
    if (hasOutput) {
      Message.warning('该节点已有输出')
      popVisible.value = false
      return
    }
  }
  addChildNode(graph, node, type)
  popVisible.value = false
}

function handleDeleteNode() {
  deleteNode(graph, node)
}

function handleNodeClick() {
  if (type.value === 'start')
    return
  selectNode(node)
}
</script>

<template>
  <div class="node-box">
    <Popover v-if="tooltipMessage" content-class="node-tooltip-content">
      <NodeItem2
        :active="active"
        :status="status"
        :type="type"
        :config="config"
        :close-btn-visible="closeBtnVisible"
        :verify-error-message="verifyErrorMessage"
        @pop-click="handlePopClick"
        @node-click="handleNodeClick"
        @delete-node="handleDeleteNode"
      />
      <template #content>
        <vc-scrollbar>
          {{ tooltipMessage }}
        </vc-scrollbar>
      </template>
    </Popover>
    <NodeItem2
      v-else
      :active="active"
      :status="status"
      :type="type"
      :config="config"
      :close-btn-visible="closeBtnVisible"
      :verify-error-message="verifyErrorMessage"
      @pop-click="handlePopClick"
      @node-click="handleNodeClick"
      @delete-node="handleDeleteNode"
    />
    <template v-if="hasMenus">
      <div class="line" />
      <Popover
        v-model:popup-visible="popVisible"
        position="rt"
        trigger="click"
        :arrow-style="{ display: 'none' }"
        content-class="node-menus-popover-content"
      >
        <PlusIcon class="plus-icon" />
        <template #content>
          <div class="x6-menu">
            <div
              v-for="item in config.menus"
              :key="item.label"
              class="menu-item"
              @click="handlePopClick(item)"
            >
              <component :is="getIcon(item.value as NodeTypeKeys)" />
              <span>{{ item.label }}</span>
            </div>
          </div>
        </template>
      </Popover>
    </template>
    <span v-if="verifyErrorMessage" class="verify-error-message">
      {{ verifyErrorMessage }}
    </span>
  </div>
</template>

<style lang="less" scoped>
svg:focus-visible,
svg:focus {
  outline: none;
}

.node-box {
  position: relative;
  // width: 180px;
  // height: 40px;
  width: 100%;
  height: 100%;
}

.x6-menu {
  padding: 0;
  .menu-item {
    display: flex;
    align-items: center;
    padding: 0 8px;
    width: 94px;
    height: 32px;
    font-size: 14px;
    color: #1d2129;
    border-radius: 4px;
    gap: 6px;
    cursor: pointer;
    font-weight: 400;
    line-height: 20px;
    &:hover {
      background: #f2f3f5;
    }
  }
}

.plus-icon {
  position: absolute;
  top: 50%;
  right: -41px;
  z-index: 10;
  width: 20px;
  height: 20px;
  cursor: pointer;
  transform: translateY(-50%);
}
.line {
  position: absolute;
  top: 50%;
  right: -25px;
  z-index: -1;
  display: inline-block;
  width: 25px;
  height: 1px;
  background-color: #c9cdd4;
  transform: translateY(-50%);
}

.verify-error-message {
  position: absolute;
  bottom: -20px;
  left: 50%;
  font-size: 12px;
  white-space: nowrap;
  color: #f53f3f;
  font-weight: 400;
  line-height: 18px;
  transform: translateX(-50%);
}
</style>

<style lang="less">
.node-menus-popover-content {
  padding: 8px;
  background: #fff;
  border-radius: 6px;
  .arco-popover-content {
    margin-top: 0;
  }
}

.node-tooltip {
  position: absolute;
  inset: 0;
}

@content-height: 200px - (12px * 2);
.arco-trigger-content.node-tooltip-content {
  padding: 12px 16px;
  max-width: 400px;
  max-height: 200px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  .arco-popover-content {
    margin-top: 0;
    max-height: @content-height;
    .vc-scrollbar,
    .vc-scrollbar__wrap {
      max-height: @content-height;
    }
  }
}
</style>
