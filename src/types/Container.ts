import type { ContainerItem } from './ContainerItem'

export type Container = {
  name: string
  sizeX: number
  sizeY: number
  sizeZ: number
  label: string
  containerItems: ContainerItem[]
}
