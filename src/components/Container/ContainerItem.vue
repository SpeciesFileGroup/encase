<template>
  <TresGroup :position="meshPosition">
    <TresMesh
      name="ContainerItemMesh"
      :user-data="{ x, y, z }"
      @click="(event: MouseEvent) => emit('click', event)"
      @context-menu="(event: MouseEvent) => emit('context-menu', event)"
    >
      <TresBoxGeometry :args="[size, size, size]" />
      <TresMeshToonMaterial :color="itemColor" />
    </TresMesh>
    <Suspense>
      <Text3D
        shadow
        name="text"
        :text="containerItem?.label"
        :font="fontPath"
        :size="0.2"
        :depth="0"
        :curve-segments="5"
        :need-updates="true"
        :bevel-enabled="false"
        :position="[0, size / 2 + 0.3, 0]"
        look-at-camera
        center
      />
    </Suspense>
  </TresGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ContainerItem } from '@/types'
import { getPosition } from '@/utils'
import { COLORS } from '@/constants'
import Text3D from '../Text3D.vue'
import fontPath from '@/assets/fonts/Roboto_Regular.json?url'

type Props = {
  x: number
  y: number
  z: number
  size: number
  space: number
  selected: boolean
  containerItem: ContainerItem | undefined
}

const props = defineProps<Props>()
const emit = defineEmits(['click', 'context-menu'])

const itemColor = computed<string>(() => {
  if (props.selected) {
    return COLORS.ContainerItemSelected
  }

  return props.containerItem
    ? COLORS.ContainerItemFilled
    : COLORS.ContainerItemEmpty
})

const meshPosition = computed<number[]>(() => {
  const { x, y, z, size, space } = props
  const args = {
    itemSize: size,
    padding: space
  }
  return [
    getPosition({ position: x, ...args }),
    getPosition({ position: y, ...args }),
    getPosition({ position: z, ...args })
  ]
})
</script>
