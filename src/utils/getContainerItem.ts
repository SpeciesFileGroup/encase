import type { ContainerItem, Container } from '@/types'
import { getContainerPositionByCoordinates } from '@/utils'

export function getContainerItem(
  coordinates: number[],
  container: Container
): ContainerItem | undefined {
  const pos = getContainerPositionByCoordinates(
    [container.sizeX, container.sizeY, container.sizeZ],
    coordinates
  )

  return container.containerItems.find(
    (item: ContainerItem) => item.position === pos
  )
}
