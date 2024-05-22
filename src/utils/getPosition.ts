export function getPosition({
  position,
  padding,
  itemSize
}: {
  position: number
  padding: number
  itemSize: number
}): number {
  return position * (itemSize + padding)
}
