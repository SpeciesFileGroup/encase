import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const KEYS = {
  Control: 'Control',
  Shift: 'Shift'
}

export function useKeyboardKeys() {
  const keysPressed = ref<string[]>([])

  const isKeyControlPressed = computed<boolean>(() =>
    keysPressed.value.includes(KEYS.Control)
  )
  const isKeyShiftPressed = computed<boolean>(() =>
    keysPressed.value.includes(KEYS.Shift)
  )

  const handleKeyboardKeydownEvent = (e: KeyboardEvent): void => {
    if (!keysPressed.value.includes(e.key)) {
      keysPressed.value.push(e.key)
    }
  }

  const handleKeyboardKeyUpEvent = (e: KeyboardEvent): void => {
    keysPressed.value = keysPressed.value.filter((key) => e.key !== key)
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyboardKeydownEvent)
    window.addEventListener('keyup', handleKeyboardKeyUpEvent)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyboardKeydownEvent)
    window.removeEventListener('keyup', handleKeyboardKeyUpEvent)
  })

  return {
    isKeyControlPressed,
    isKeyShiftPressed
  }
}
