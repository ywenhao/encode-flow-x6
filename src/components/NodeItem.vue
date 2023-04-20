<script setup lang="ts">
import { ref } from 'vue'

import 'element-plus/es/components/popover/style/css'
import { ElPopover } from 'element-plus'

const visible = ref(false)

interface MenuItem {
  label: string
  value: string
}

const menuList = ref<MenuItem[]>([
  {
    label: 'test1',
    value: 'test1',
  },
  {
    label: 'test2',
    value: 'test2',
  },
  {
    label: 'test3',
    value: 'test3',
  },
])

function onClick(item: MenuItem) {
  console.log(item)

  visible.value = false
}
</script>

<template>
  <div class="node-item">
    <div>test</div>
    <ElPopover v-model:visible="visible" :offset="0" trigger="click">
      <template #reference>
        <div class="plus">
          +
        </div>
      </template>
      <div class="menu">
        <div v-for="(item, index) in menuList" :key="index" class="menu-item" @click="onClick(item)">
          {{ item.label }}
        </div>
      </div>
    </ElPopover>
  </div>
</template>

<style scoped>
.node-item {
  width: 100%;
  height: 100%;
  border: 1px solid red;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  position: relative;
}

.plus {
  cursor: pointer;
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
