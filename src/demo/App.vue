<template>
  <ContainerVisualization
    ref="containerRef"
    class="container-3d"
    v-bind="opts"
    v-model:selected-items="selectedItems"
    @container-item:right-click="openModal"
  />
  <div class="settings">
    <button
      type="button"
      @click="() => containerRef.resetView()"
    >
      Reset view
    </button>
    <h2>Container</h2>
    <div>
      <label>
        <input
          type="checkbox"
          v-model="opts.enclose"
        />
        Enclose
      </label>
    </div>

    <ContainerSize v-model="opts.container" />

    <CurrentLevel
      :levels="opts.container.sizeY"
      v-model="opts.currentLevel"
    />

    <ContainerItem v-model="opts" />

    <div>
      <h3>Event debug</h3>
      <pre v-text="JSON.stringify(currentEvent, null, 2)" />
    </div>
    <ContainerItems
      :container-items="opts.container.containerItems"
      @remove="(index: number) => opts.container.containerItems.splice(index, 1)"
    />
    <ContainerSelected :selected="selectedItems" />
  </div>
  <ContainerItemModal ref="containerItemModalRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContainerVisualization from '../components/ContainerVisualization.vue'
import ContainerItemModal from './ContainerItemModal.vue'
import ContainerItems from './settings/ContainerItems.vue'
import ContainerItem from './settings/ContainerItem.vue'
import ContainerSize from './settings/ContainerSize.vue'
import CurrentLevel from './settings/CurrentLevel.vue'
import ContainerSelected from './settings/ContainerSelected.vue'

const opts = ref({
  padding: 1,
  enclose: true,
  itemSize: 1,
  currentLevel: 0,
  container: {
    name: 'Test',
    disposition: 'disp',
    label: 'testing',
    sizeX: 12,
    sizeY: 2,
    sizeZ: 8,
    containerItems: [
      {
        label: 'CO 1234',
        position: 0
      },
      {
        label: 'CO 4567',
        position: 4
      }
    ]
  }
})

const containerRef = ref()
const containerItemModalRef = ref<InstanceType<typeof ContainerItem>>(null)
const currentEvent = ref({})
const selectedItems = ref([])

async function openModal(event) {
  const label = event.containerItem?.label
  const position = event.arrIndex
  currentEvent.value = event

  await new Promise((resolve) => setTimeout(resolve, 50))

  const payload = await containerItemModalRef.value.show({
    label
  })

  if (payload) {
    const index = opts.value.container.containerItems.findIndex(
      (item) => item.position === position
    )

    if (index > -1) {
      if (payload.label) {
        opts.value.container.containerItems[index] = {
          label: payload.label,
          position
        }
      } else {
        opts.value.container.containerItems.splice(index, 1)
      }
    } else {
      opts.value.container.containerItems.push({ ...payload, position })
    }
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app,
.container-3d {
  width: 100%;
  height: 100%;
}

.settings {
  width: 240px;
  background-color: #ffffff;
  padding: 1rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  overflow-y: scroll;
  max-height: 100%;
}

.d-block {
  display: block;
}

input[type='number'] {
  width: 30px;
  margin-right: 4px;
}
</style>