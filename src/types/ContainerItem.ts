import type { Position } from './Position'

type CustomColor = {
  selected: string
  empty: string
  filled: string
}

type ContainerItemStyle = {
  color?: CustomColor
}

export type ContainerItem = {
  position: Position
  label?: string
  style?: ContainerItemStyle
  metadata?: { [key: string]: any } | null
}
