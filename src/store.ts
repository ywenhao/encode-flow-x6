import type { Node } from '@antv/x6'
import { reactive, ref } from 'vue'

function createStore() {
  const isEdit = ref(false)
  const selectNode = ref<Node>()
  return reactive({ isEdit, selectNode })
}

export const store = createStore()
