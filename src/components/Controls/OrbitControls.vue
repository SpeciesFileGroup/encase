<template>
  <TresOrbitControls
    v-if="renderer"
    ref="controlsRef"
    :enablePan="false"
    :args="[camera, renderer?.domElement]"
  />
</template>

<script setup lang="ts">
import { onUnmounted, watch, ref } from 'vue'
import { useTresContext, useRenderLoop } from '@tresjs/core'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const { camera, renderer, extend, controls } = useTresContext()

const controlsRef = ref<OrbitControls | null>(null)

extend({ OrbitControls })

watch(controlsRef, (value) => {
  if (value) {
    controls.value = value
  } else {
    controls.value = null
  }
})

const { onLoop } = useRenderLoop()

onLoop(() => {
  if (controlsRef.value) {
    controlsRef.value.update()
  }
})

onUnmounted(() => {
  if (controlsRef.value) {
    controlsRef.value.dispose()
  }
})

defineExpose({ value: controlsRef })
</script>
