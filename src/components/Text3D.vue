<template>
  <TresMesh
    v-if="font"
    ref="text3DRef"
  >
    <TresTextGeometry
      v-if="localText"
      :args="[localText, textOptions]"
      :center="center"
    />
    <slot></slot>
  </TresMesh>
</template>

<script setup lang="ts">
import {
  computed,
  shallowRef,
  toRefs,
  toValue,
  useSlots,
  watchEffect,
  onUnmounted
} from 'vue'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { useTresContext, useRenderLoop } from '@tresjs/core'

type Glyph = {
  _cachedOutline: string[]
  ha: number
  o: string
}

type FontData = {
  boundingBox: {
    yMax: number
    yMin: number
  }
  familyName: string
  glyphs: {
    [k: string]: Glyph
  }
  resolution: number
  underlineThickness: number
}

type Text3DProps = {
  font: FontData | string
  text?: string
  size?: number
  depth?: number
  curveSegments?: number
  bevelEnabled?: boolean
  bevelThickness?: number
  bevelSize?: number
  bevelOffset?: number
  bevelSegments?: number
  center?: boolean
  lookAtCamera?: boolean
  needUpdates?: boolean
}

const props = withDefaults(defineProps<Text3DProps>(), {
  size: 0.5,
  depth: 0,
  curveSegments: 5,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 4,
  center: false,
  lookAtCamera: false,
  needUpdates: false
})

const {
  center,
  font,
  text,
  needUpdates,
  size,
  depth,
  curveSegments,
  bevelEnabled,
  bevelThickness,
  bevelSize,
  bevelOffset,
  bevelSegments
} = toRefs(props)

const { extend, camera } = useTresContext()
const { onLoop } = useRenderLoop()

extend({ TextGeometry })

const loader = new FontLoader()
const slots = useSlots()
const localText = computed(() => {
  if (text?.value) {
    return text.value
  } else if (slots.default) {
    return (slots.default()[0].children as string)?.trim()
  }
  return needUpdates.value ? '' : ''
})

const text3DRef = shallowRef()

defineExpose({
  value: text3DRef
})

const localFont = await new Promise((resolve, reject) => {
  try {
    if (typeof font.value === 'string') {
      loader.load(font.value, (font) => {
        resolve(font)
      })
    } else {
      resolve(font.value)
    }
  } catch (error) {
    reject(console.error('error', error))
  }
})

const textOptions = computed(() => ({
  font: localFont,
  size: toValue(size),
  depth: toValue(depth),
  curveSegments: toValue(curveSegments),
  bevelEnabled: toValue(bevelEnabled),
  bevelThickness: toValue(bevelThickness),
  bevelSize: toValue(bevelSize),
  bevelOffset: toValue(bevelOffset),
  bevelSegments: toValue(bevelSegments)
}))

watchEffect(() => {
  if (text3DRef.value && needUpdates.value) {
    text3DRef.value.geometry.dispose()
    text3DRef.value.geometry = new TextGeometry(
      localText.value,
      textOptions.value
    )
    if (center.value) {
      text3DRef.value.geometry.center()
    }
  }
})

onLoop(() => {
  if (props.lookAtCamera) {
    text3DRef.value?.lookAt(camera.value?.position)
  }
})

onUnmounted(() => {
  if (text3DRef.value) {
    text3DRef.value.dispose()
  }
})
</script>
