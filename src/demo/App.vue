<template>
  <div class="main-container">
    <div class="settings">
      <div class="title">
        <h2>Container</h2>
        <button
          type="button"
          @click="resetDemo"
        >
          Reset
        </button>
      </div>
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

      <ContainerItems
        :container-items="opts.container.containerItems"
        @remove="(index: number) => opts.container.containerItems.splice(index, 1)"
      />
      <ContainerDebug :current-event="currentEvent" />
      <ContainerSelected :selected="selectedItems" />
    </div>
    <ContainerVisualization
      ref="containerRef"
      class="container-3d"
      v-bind="opts"
      v-model:selected-items="selectedItems"
      @container-item:right-click="openModal"
    />
  </div>
  <ContainerItemModal ref="containerItemModalRef" />
  <GithubRepo />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContainerVisualization from '../components/ContainerVisualization.vue'
import ContainerItemModal from './ContainerItemModal.vue'
import ContainerItems from './settings/ContainerItems.vue'
import ContainerItem from './settings/ContainerItem.vue'
import ContainerSize from './settings/ContainerSize.vue'
import ContainerDebug from './settings/ContainerDebug.vue'
import ContainerSelected from './settings/ContainerSelected.vue'
import CurrentLevel from './settings/CurrentLevel.vue'
import GithubRepo from './GithubRepo.vue'

const opts = ref(makeDefaultConfig())
const containerRef = ref()
const containerItemModalRef = ref<InstanceType<typeof ContainerItem>>(null)
const currentEvent = ref({})
const selectedItems = ref([])

async function openModal(event) {
  const label = event?.label
  const { position } = event
  currentEvent.value = event

  await new Promise((resolve) => setTimeout(resolve, 50))

  const payload = await containerItemModalRef.value.show({
    label
  })

  if (payload) {
    const index = opts.value.container.containerItems.findIndex(
      (item) =>
        item.position.x === position.x &&
        item.position.y === position.y &&
        item.position.z === position.z
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

function makeDefaultConfig() {
  return {
    cameraPosition: {
      x: 100,
      y: 100,
      z: 100
    },
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
          metadata: {
            id: 1,
            type: 'test'
          },
          position: {
            x: 0,
            y: 0,
            z: 0
          },
          style: {
            color: {
              filled: 'orange',
              selected: 'green'
            }
          }
        },
        {
          label: 'CO 4567',
          position: {
            x: 4,
            y: 0,
            z: 0
          }
        }
      ]
    }
  }
}

function resetDemo() {
  opts.value = makeDefaultConfig()
  containerRef.value.resetView()
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

#app,
.container-3d {
  width: 100%;
  height: 100%;
}

.main-container {
  display: flex;
  height: 100vh;
  width: 10wv;
  max-width: 100wv;
  flex-direction: row;
  align-items: start;
}

.settings {
  width: 320px;
  box-sizing: border-box;
  background-color: #ffffff;
  padding: 0.5rem 2rem;
  z-index: 10;
  overflow-y: auto;
  max-height: 100%;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
}

.d-block {
  display: block;
}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

input[type='number'] {
  width: 30px;
  margin-right: 4px;
}
</style>
