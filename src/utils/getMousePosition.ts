export function getMousePosition(element: HTMLElement, event: MouseEvent) {
  const rect = element.getBoundingClientRect()

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}
