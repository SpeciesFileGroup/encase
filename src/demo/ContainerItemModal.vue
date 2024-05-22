<template>
  <VModal
    v-if="state.showModal"
    @close="_cancel"
  >
    <template #header>
      <h3>Container item</h3>
    </template>
    <template #body>
      <div>
        <div>
          <label class="d-block">Label</label>
          <input
            ref="inputRef"
            type="text"
            autofocus
            v-model="state.label"
            @keydown.enter="_confirm"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        @click="_confirm"
      >
        Set
      </button>
      <button @click="_cancel">Cancel</button>
    </template>
  </VModal>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue'
import VModal from '@/demo/Modal.vue'

const inputRef = ref(null)

const state = reactive({
  label: '',
  showModal: false,
  resolvePromise: undefined,
  rejectPromise: undefined
})

function show(opts = {}) {
  state.label = opts.label || ''
  state.showModal = true

  nextTick(() => {
    inputRef.value.focus()
  })

  return new Promise((resolve, reject) => {
    state.resolvePromise = resolve
    state.rejectPromise = reject
  })
}

function _confirm() {
  const payload = {
    label: state.label
  }
  state.showModal = false
  state.resolvePromise(payload)
}

function _cancel() {
  state.showModal = false
  state.resolvePromise(false)
}

defineExpose({
  show
})
</script>
