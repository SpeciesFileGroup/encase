<template>
  <div>
    <h2 class="setting-title">Selected boxes</h2>
    <pre v-text="JSON.stringify(selected, null, 2)" />
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
