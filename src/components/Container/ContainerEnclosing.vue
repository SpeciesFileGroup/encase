<template>
  <TresMesh>
    <TresMeshPhysicalMaterial v-bind="ATTRIBUTES" />
    <TresBoxGeometry :args="boxSize" />
  </TresMesh>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  size: number[]
  padding: number
  itemSize: number
}

const ATTRIBUTES = {
  color: 0xffffff,
  transparent: true,
  opacity: 0.2,
  roughness: 0.1,
  metalness: 0,
  transmission: 1,
  ior: 1.5,
  reflectivity: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1
}

const props = defineProps<Props>()

const boxSize = computed<number[]>(() => {
  return props.size.map(
    (coordinate) => coordinate + (props.padding * coordinate) / props.itemSize
  )
})
</script>
