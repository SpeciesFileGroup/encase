<template>
  <div>
    <h3>Items</h3>
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
