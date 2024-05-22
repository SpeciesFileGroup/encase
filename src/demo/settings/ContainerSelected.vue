<template>
  <div>
    <h3>Selected boxes</h3>
    <pre>
  {{ JSON.stringify(selected, null, 2) }}
  </pre
    >
  </div>
</template>

<script setup>
defineProps({
  selected: {
    type: Array,
    required: true
  }
})
</script>
