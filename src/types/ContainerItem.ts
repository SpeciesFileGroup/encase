export type ContainerItem = {
  label: string
  position: number
  metadata?: { [key: string]: any }
}

export type SelectedContainerItem = {
  position: {
    x: number
    y: number
    z: number
  }
  containerItem: ContainerItem | null
  arrIndex: number
}
