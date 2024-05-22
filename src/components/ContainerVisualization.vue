<template>
  <div ref="rootRef">
    <TresCanvas
      v-bind="canvasOpts"
      ref="sceneRef"
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
                :container-item="getContainerItem([x, y, z])"
                @contextmenu.prevent=""
                @click="
                  (e) => {
                    onClick({ x, y, z }, e)
                  }
                "
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
import type {
  Container,
  ContainerItem,
  Position,
  SelectedContainerItem,
  CanvasOptions
} from '@/types'
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { TresCanvas } from '@tresjs/core'
import { useKeyboardKeys } from '@/composables'
import {
  getContainerPositionByCoordinates,
  calculateCameraDistance,
  getPosition
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

const orbitEnabled = ref(true)
const CAMERA_FOV = 25

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

const rootRef = ref()
const sceneRef = ref<InstanceType<typeof TresCanvas>>()
const { isKeyControlPressed, isKeyShiftPressed } = useKeyboardKeys()

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

const selectedItems = defineModel<SelectedContainerItem[]>('selectedItems', {
  type: Array,
  default: () => []
})

const emit = defineEmits([
  EVENT.ContainerItemClick,
  EVENT.ContainerItemLeftClick,
  EVENT.ContainerItemRightClick
])

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
  return selectedItems.value.some(
    ({ position }: { position: Position }) =>
      position.x === coordinates.x &&
      position.y === coordinates.y &&
      position.z === coordinates.z
  )
}

function containerItemSelected(
  positions: Position[],
  { toggle = false }: { toggle: boolean }
) {
  const items = positions.map(makeSelectedItemPayload)

  if (isKeyControlPressed.value) {
    const uniqueItems: SelectedContainerItem[] = []
    const duplicated: SelectedContainerItem[] = []

    items.forEach((item) => {
      if (!isSelected(item.position)) {
        uniqueItems.push(item)
      } else {
        duplicated.push(item)
      }
    })

    selectedItems.value.push(...uniqueItems)

    if (toggle) {
      duplicated.forEach(removeItemFromSelectedList)
    }
  } else {
    selectedItems.value = items
  }
}

function removeItemFromSelectedList(item: SelectedContainerItem) {
  const index = selectedItems.value.findIndex(
    ({ position }) =>
      position.x === item.position.x &&
      position.y === item.position.y &&
      position.z === item.position.z
  )

  if (index > -1) {
    selectedItems.value.splice(index, 1)
  }
}

function makeSelectedItemPayload(position: Position): SelectedContainerItem {
  const coordinates = Object.values(position)
  const arrPosition = getContainerPositionByCoordinates(
    containerSize.value,
    coordinates
  )

  return {
    position,
    containerItem: getContainerItem(coordinates) ?? null,
    arrIndex: arrPosition
  }
}

function getContainerItem(coordinates: number[]): ContainerItem | undefined {
  const pos = getContainerPositionByCoordinates(
    containerSize.value,
    coordinates
  )

  return props.container.containerItems.find((item) => item.position === pos)
}

watch(containerSize, resetView)

onMounted(resetView)

function getDefaultCameraDistance() {
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
    y: 25,
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
