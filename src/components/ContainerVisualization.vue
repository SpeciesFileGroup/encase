<template>
  <div
    ref="rootRef"
    :style="ROOT_STYLE"
  >
    <TresCanvas
      ref="sceneRef"
      v-bind="canvasOpts"
    >
      <TresPerspectiveCamera
        :fov="CAMERA_FOV"
        :near="0.5"
        :far="2000"
      />

      <TresGroup
        ref="groupRef"
        :key="axisKey"
        :position="containerGroupPosition"
      >
        <template
          v-for="(_, x) in container.sizeX"
          :key="x"
        >
          <template
            v-for="(_, y) in container.sizeY"
            :key="`${x}${y}`"
          >
            <TresGroup
              v-if="typeof currentLevel !== 'number' || currentLevel == y"
            >
              <VContainerItem
                v-for="(_, z) in container.sizeZ"
                :key="`${x}${y}${z}`"
                :x="x"
                :y="y"
                :z="z"
                :size="itemSize"
                :space="padding"
                :selected="isSelected({ x, y, z })"
                :container-item="getContainerItem({ x, y, z })"
                :handle-events="{
                  onClick,
                  onMouseOver,
                  onMouseOut
                }"
              />
            </TresGroup>
          </template>
        </template>
      </TresGroup>
      <VContainerEnclosing
        v-if="enclose"
        :size="
          [container.sizeX, container.sizeY, container.sizeZ].map(
            (item) => item * props.itemSize
          )
        "
        :item-size="itemSize"
        :padding="padding"
      />

      <TresAmbientLight :intensity="0.5" />

      <OrbitControls :enabled="orbitEnabled" />
      <TresDirectionalLight
        :position="[props.container.sizeX, 18, props.container.sizeZ]"
        :intensity="0.5"
        cast-shadow
      />
      <TresDirectionalLight
        :position="[-props.container.sizeX, 18, props.container.sizeZ]"
        :intensity="0.2"
        cast-shadow
      />
    </TresCanvas>
    <DragSelector
      v-if="sceneRef?.context && isKeyShiftPressed"
      :context="sceneRef.context"
      :container="rootRef"
      @selected="(items) => containerItemSelected(items, { toggle: false })"
    />
  </div>
</template>

<script setup lang="ts">
import type { Container, ContainerItem, Position, CanvasOptions } from '@/types'
import { reactive, ref, computed, watch, onMounted, CSSProperties } from 'vue'
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { TresCanvas } from '@tresjs/core'
import { useKeyboardKeys } from '@/composables'
import {
  calculateCameraDistance,
  getPosition,
  hasSameCoordinates
} from '@/utils'

import VContainerItem from './Container/ContainerItem.vue'
import VContainerEnclosing from './Container/ContainerEnclosing.vue'
import DragSelector from './Controls/DragSelector.vue'
import OrbitControls from './Controls/OrbitControls.vue'
import { EVENT, COLORS } from '@/constants'

type Props = {
  itemSize?: number
  padding?: number
  container: Container
  enclose: boolean
  currentLevel: number | undefined
  canvas?: CanvasOptions
}

const CAMERA_FOV = 25
const ROOT_STYLE: CSSProperties = {
  position: 'relative'
}

const props = withDefaults(defineProps<Props>(), {
  itemSize: 1,
  padding: 1,
  enclose: false
})

const canvasOpts = reactive({
  clearColor: props.canvas?.backgroundColor || COLORS.Scene,
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputEncoding: SRGBColorSpace,
  toneMapping: NoToneMapping
})

const { isKeyControlPressed, isKeyShiftPressed } = useKeyboardKeys()

const rootRef = ref()
const sceneRef = ref<InstanceType<typeof TresCanvas>>()
const orbitEnabled = ref(true)

const containerSize = computed(() => [
  props.container.sizeX,
  props.container.sizeY,
  props.container.sizeZ
])

const containerGroupPosition = computed(() => {
  const args = {
    itemSize: props.itemSize,
    padding: props.padding
  }

  return [
    -getPosition({ position: props.container.sizeX - 1, ...args }) / 2,
    -getPosition({ position: props.container.sizeY - 1, ...args }) / 2,
    -getPosition({ position: props.container.sizeZ - 1, ...args }) / 2
  ]
})

const axisKey = computed(
  () =>
    `x${containerSize.value[0]}y${containerSize.value[1]}z${containerSize.value[2]}`
)

const selectedItems = defineModel<ContainerItem[]>('selectedItems', {
  type: Array,
  default: () => []
})

const emit = defineEmits([
  EVENT.ContainerItemClick,
  EVENT.ContainerItemLeftClick,
  EVENT.ContainerItemRightClick,
  EVENT.ContainerItemMouseOut,
  EVENT.ContainerItemMouseOver
])

function onMouseOver(position: Position, e: MouseEvent) {
  const payload = makeSelectedItemPayload(position)

  emit(EVENT.ContainerItemMouseOver, payload, e)
}

function onMouseOut(position: Position, e: MouseEvent) {
  const payload = makeSelectedItemPayload(position)

  emit(EVENT.ContainerItemMouseOut, payload, e)
}

function onClick(position: Position, e: MouseEvent) {
  const payload = makeSelectedItemPayload(position)
  const toggle = e.button === 0

  switch (e.button) {
    case 0:
      emit(EVENT.ContainerItemLeftClick, payload, e)
      break
    case 2:
      emit(EVENT.ContainerItemRightClick, payload, e)
      break
  }

  emit(EVENT.ContainerItemClick, payload, e)

  containerItemSelected([position], { toggle })
}

function isSelected(coordinates: Position): boolean {
  return selectedItems.value.some((item: ContainerItem) =>
    hasSameCoordinates(item.position, coordinates)
  )
}

function containerItemSelected(
  positions: Position[],
  { toggle = false }: { toggle: boolean }
) {
  const items = positions.map(makeSelectedItemPayload)

  if (isKeyControlPressed.value) {
    const uniqueItems: ContainerItem[] = []
    const duplicated: ContainerItem[] = []

    items.forEach((item) => {
      if (!isSelected(item.position)) {
        uniqueItems.push(item)
      } else {
        duplicated.push(item)
      }
    })

    selectedItems.value = [...selectedItems.value, ...uniqueItems]

    if (toggle && duplicated.length) {
      selectedItems.value = selectedItems.value.filter(
        (item) =>
          !duplicated.some((d) => hasSameCoordinates(item.position, d.position))
      )
    }
  } else {
    selectedItems.value = items
  }
}

function makeSelectedItemPayload(position: Position): ContainerItem {
  const { metadata = null, label } = getContainerItem(position) || {}

  return {
    position,
    metadata,
    label
  }
}

function getContainerItem(position: Position): ContainerItem | undefined {
  return props.container.containerItems.find((item) =>
    hasSameCoordinates(item.position, position)
  )
}

watch(containerSize, resetView)

onMounted(resetView)

function getDefaultCameraDistance(): Position {
  const { sizeX, sizeY, sizeZ } = props.container
  const [x, y, z] = containerGroupPosition.value

  const zPos = calculateCameraDistance(
    { x, y, z },
    {
      x: sizeX + sizeX * props.itemSize,
      y: sizeY + sizeY * props.itemSize,
      z: sizeZ + sizeZ * props.itemSize
    },
    CAMERA_FOV
  )

  return {
    x: 0,
    y: 30,
    z: zPos
  }
}

function resetView() {
  if (sceneRef.value?.context) {
    const { camera } = sceneRef.value.context

    if (camera.value) {
      Object.assign(camera.value.position, getDefaultCameraDistance())
    }
  }
}

defineExpose({
  resetView
})
</script>
