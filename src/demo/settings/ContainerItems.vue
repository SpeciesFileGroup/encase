<template>
  <div>
    <h3>Container items</h3>
    <div
      v-for="(item, index) in containerItems"
      class="row"
    >
      <span class="d-block">{{ item.label }}</span>
      <button
        type="button"
        @click="emit('remove', index)"
      >
        -
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  containerItems: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['remove'])
</script>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid gray;
  padding: 0.5rem 0.5rem;
}
</style>
