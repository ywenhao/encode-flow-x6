<script setup lang="ts">
import type { Node } from '@antv/x6'
import { Popover } from '@arco-design/web-vue'
import { computed, inject, ref } from 'vue'
import CloseIcon from './icons/CloseIcon.vue'

interface MenuItem {
  label: string
  value: string
}

const visible = ref(false)

const getNode = inject('getNode') as () => Node
const node = getNode()
const data = ref(node.getData() || {})

node.on('change:data', ({ current }) => {
  data.value = current
})

console.log(node)

const menuList = computed<MenuItem[]>(() => data.value.menuList || [])
const status = computed(() => data.value.status || null)
const closeBtnVisible = computed(() => data.value.closeBtnVisible || false)

function onClick(item: MenuItem) {
  console.log(item)

  visible.value = false
}
</script>

<template>
  <div class="node-item" :class="[status]">
    <div>test</div>
    <Popover v-model:popup-visible="visible">
      <CloseIcon class="close-icon" />
      <template #content>
        <div class="menu">
          <div v-for="(item, index) in menuList" :key="index" class="menu-item" @click="onClick(item)">
            {{ item.label }}
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>

<style lang="less" scoped>
.node-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  position: relative;
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
  &:hover {
    background-color: #F7F8FA;
  }
  &.success {
    color: #00B42A;
    border-color: #00B42A;
    &:hover {
      background-color: #E8FFEA;
    }
  }
  &.error {
    color: #F53F3F;
    border-color: #F53F3F;
    &:hover {
      background-color: #FFDFD9;
    }
  }
}

.close-icon {
  width: 16px;
  height: 16px;
}

.popover {
  background: #fff;
  box-shadow: 10px 10px 10px #80adf1;
  position: absolute;
  cursor: pointer;
  width: 100px;
}
.menu {
  padding: 2px 0;
}
.menu-item {
  cursor: pointer;
  padding: 5px;
  text-align: center;
  margin: 5px 0;
}

.menu-item:hover {
  background: #f2fcff;
}
</style>
