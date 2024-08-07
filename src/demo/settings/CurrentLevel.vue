<template>
  <div>
    <h2 class="setting-title">Level</h2>
    <ul>
      <li>
        <label>
          <input
            type="radio"
            :value="undefined"
            v-model="selectedLevel"
          />
          All
        </label>
      </li>
      <li v-for="(n, index) in levels">
        <label>
          <input
            type="radio"
            :value="index"
            v-model="selectedLevel"
          />
          {{ n }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
type Props = {
  levels: number
}

defineProps<Props>()

const selectedLevel = defineModel<number | undefined>()
</script>

<style scoped>
ul {
  margin: 0px;
  list-style: none;
  padding: 0;
}
</style>
