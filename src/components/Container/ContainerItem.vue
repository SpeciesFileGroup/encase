<template>
  <TresGroup :position="meshPosition">
    <TresMesh
      name="ContainerItemMesh"
      :user-data="{ x, y, z }"
      @pointer-enter="(event: MouseEvent) => handleEvents.onMouseOver({ x, y, z }, event)"
      @pointer-leave="(event: MouseEvent) => handleEvents.onMouseOut({ x, y, z }, event)"
      @click="(event: MouseEvent) => handleEvents.onClick({ x, y, z }, event)"
      @context-menu="(event: MouseEvent) => handleEvents.onClick({ x, y, z }, event)"
    >
      <TresBoxGeometry :args="[size, size, size]" />
      <TresMeshToonMaterial :color="itemColor" />
    </TresMesh>
    <Suspense>
      <Text3D
        shadow
        name="text"
        need-updates
        :text="containerItem?.label"
        :font="fontPath"
        :size="0.2"
        :depth="0"
        :curve-segments="5"
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
  handleEvents: {
    onClick: Function
    onMouseOver: Function
    onMouseOut: Function
  }
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
