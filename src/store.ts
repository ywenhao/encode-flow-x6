import { reactive, ref } from 'vue'

function createStore() {
  const isEdit = ref(false)
  return reactive({ isEdit })
}

export const store = createStore()
