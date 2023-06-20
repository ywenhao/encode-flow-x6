<script setup lang="ts">
import type { Node } from '@antv/x6'
import { Popover } from '@arco-design/web-vue'
import { inject, ref } from 'vue'

const visible = ref(false)

const getNode = inject('getNode') as () => Node
const node = getNode()
const data = ref(node.getData())

node.on('change:data', ({ current }) => {
  data.value = current
})

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

// const data = node.getData()
// console.log(data)
</script>

<template>
  <div class="node-item">
    <div>test</div>
    <Popover v-model:popup-visible="visible" trigger="click">
      <div class="plus">
        +
      </div>
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

<style scoped>
.node-item {
  width: 100%;
  height: 100%;
  border: 1px solid;
  border-color: v-bind("data.color");
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
