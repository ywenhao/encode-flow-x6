<script setup lang="ts">
import CloseIcon from './icons/CloseIcon.vue'
import ErrorIcon from './icons/ErrorIcon.vue'
import SuccessIcon from './icons/SuccessIcon.vue'
import type { LabelValue, NodeData, NodeItem, NodeType } from './types'

const props = defineProps<{
  active: boolean
  status: NodeData['status']
  type: NodeType
  config: NodeItem
  closeBtnVisible: boolean
  verifyErrorMessage?: string
}>()

const emit = defineEmits<{
  'pop-click': [item: LabelValue]
  'node-click': []
  'delete-node': []
}>()

const NormalIcon = props.config.icon
</script>

<template>
  <div
    class="node-item"
    :class="[status, type, { active }]"
    @click="emit('node-click')"
  >
    <SuccessIcon v-if="status === 'success'" class="success-icon" />
    <ErrorIcon v-else-if="status === 'error'" class="error-icon" />
    <NormalIcon v-else class="normal-icon" />
    <div class="node-title">
      {{ config.title }}
    </div>
    <CloseIcon
      v-if="closeBtnVisible"
      class="close-icon"
      @click.stop="emit('delete-node')"
    />
  </div>
</template>

<style lang="less" scoped>
.node-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px;
  width: 100%;
  height: 100%;
  color: #1d2129;
  background-color: #fff;
  border: 1px solid;
  border-color: transparent;
  border-radius: 30px;
  box-sizing: border-box;
  cursor: pointer;
  &.start {
    cursor: default;
    &:hover {
      background-color: #fff;
    }
  }

  &.validate-error {
    border-color: #f53f3f;
  }
  &:hover,
  &.active {
    background-color: #f7f8fa;
  }
  &.success {
    color: #00b42a;
    border-color: #00b42a;
    &:hover,
    &.active {
      background-color: #e8ffea;
    }
  }
  &.error {
    color: #f53f3f;
    border-color: #f53f3f;
    &:hover,
    &.active {
      background-color: #ffece8;
    }
  }
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
  margin-right: auto;
  margin-left: 4px;
}
</style>
