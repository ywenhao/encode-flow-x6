import type { Node } from '@antv/x6'
import { reactive, ref, shallowRef } from 'vue'

function createStore() {
  const edit = ref(false)
  const selectNode = shallowRef<Node>()
  const maxCount = ref(0)
  return reactive({ edit, selectNode, maxCount })
}

export const store = createStore()
