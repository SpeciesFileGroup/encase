<template>
  <div>
    <h2 class="setting-title">Event debug</h2>
    <pre v-text="JSON.stringify(currentEvent, null, 2)" />
  </div>
</template>

<script setup>
defineProps({
  currentEvent: {
    type: Object,
    required: true
  }
})
</script>
