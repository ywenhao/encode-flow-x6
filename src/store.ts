import type { Node } from '@antv/x6'
import { reactive, ref, shallowRef } from 'vue'

function createStore() {
  const isEdit = ref(false)
  const selectNode = shallowRef<Node>()
  return reactive({ isEdit, selectNode })
}

export const store = createStore()
