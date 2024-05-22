<template>
  <div>
    <h3>Size</h3>
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
