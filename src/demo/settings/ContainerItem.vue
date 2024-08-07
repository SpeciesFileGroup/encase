<template>
  <div>
    <h2 class="setting-title">Item</h2>
    <div>
      <input
        type="number"
        v-model="opts.itemSize"
        min="1"
      />
      <label>Size</label>
    </div>

    <div>
      <input
        type="number"
        v-model="opts.padding"
      />
      <label>Padding</label>
    </div>
  </div>
</template>

<script setup>
const opts = defineModel()
</script>
