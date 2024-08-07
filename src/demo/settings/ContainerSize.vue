<template>
  <div>
    <h2 class="setting-title">Size</h2>
    <div>
      <input
        type="number"
        v-model="container.sizeX"
      /><label>X</label>
    </div>
    <div>
      <input
        type="number"
        v-model="container.sizeY"
      /><label>Y</label>
    </div>
    <div>
      <input
        type="number"
        v-model="container.sizeZ"
      />
      <label>Z</label>
    </div>
  </div>
</template>

<script setup>
const container = defineModel()
</script>
