import type { Position } from '@/types'

export function hasSameCoordinates(
  position: Position,
  coordinates: Position
): boolean {
  return (
    position.x === coordinates.x &&
    position.y === coordinates.y &&
    position.z === coordinates.z
  )
}
