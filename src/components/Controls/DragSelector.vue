<template>
  <div
    v-if="mousePressed && startPoint"
    class="drag-box"
    :style="style"
  ></div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useSeek } from '@tresjs/core'
import { Vector3, Box3 } from 'three'
import { COLORS } from '@/constants'
import { getMousePosition } from '@/utils'

type MouseCoordinates = {
  x: number
  y: number
}

const props = defineProps({
  context: {
    type: Object,
    required: true
  },

  container: {
    type: HTMLElement,
    required: true
  }
})

const { seekAllByName } = useSeek()

const emit = defineEmits(['drag:start', 'drag:end', 'selected'])
const startPoint = ref<MouseCoordinates>(makeDefaultPosition())
const endPoint = ref<MouseCoordinates>(makeDefaultPosition())
const mousePressed = ref<boolean>(false)

const style = computed(() => ({
  left: `${Math.min(startPoint.value.x, endPoint.value.x)}px`,
  top: `${Math.min(startPoint.value.y, endPoint.value.y)}px`,
  width: `${Math.abs(startPoint.value.x - endPoint.value.x)}px`,
  height: `${Math.abs(startPoint.value.y - endPoint.value.y)}px`
}))

function makeDefaultPosition() {
  return {
    x: 0,
    y: 0
  }
}

function handleMouseMove(e: MouseEvent) {
  endPoint.value = getMousePosition(props.container, e)
}

function handleMouseDownEvent(e: MouseEvent) {
  startPoint.value = getMousePosition(props.container, e)
  mousePressed.value = true
}

function handleMouseUpEvent() {
  mousePressed.value = false
  getObjects()
}

function getObjects() {
  let minX = Math.min(startPoint.value.x, endPoint.value.x)
  let minY = Math.min(startPoint.value.y, endPoint.value.y)
  let maxX = Math.max(startPoint.value.x, endPoint.value.x)
  let maxY = Math.max(startPoint.value.y, endPoint.value.y)

  const { scene, camera } = props.context
  const children = seekAllByName(scene.value, 'ContainerItemMesh')

  const objects = children.filter((object) => {
    if (object.isMesh) {
      const box = new Box3().setFromObject(object)
      const center = box.getCenter(new Vector3())
      const vector2D = center.project(camera.value)

      vector2D.x = (vector2D.x * 0.5 + 0.5) * props.container.clientWidth
      vector2D.y = (vector2D.y * -0.5 + 0.5) * props.container.clientHeight

      return (
        vector2D.x >= minX &&
        vector2D.x <= maxX &&
        vector2D.y >= minY &&
        vector2D.y <= maxY
      )
    }
  })

  emit(
    'selected',
    objects.map((item) => item.userData)
  )
}

onMounted(() => {
  window.addEventListener('mousedown', handleMouseDownEvent)
  window.addEventListener('mouseup', handleMouseUpEvent)
  window.addEventListener('mousemove', handleMouseMove)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleMouseDownEvent)
  window.removeEventListener('mouseup', handleMouseUpEvent)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.drag-box {
  position: absolute;
  z-index: 100;
  background-color: v-bind(COLORS.ContainerItemSelected);
  opacity: 0.2;
}
</style>
