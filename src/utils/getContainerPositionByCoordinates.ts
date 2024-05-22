export function getContainerPositionByCoordinates(
  size: number[],
  coordinates: number[]
): number {
  const [sizeX, sizeY, sizeZ] = size
  const [x, y, z] = coordinates

  return x + sizeX * z + sizeX * sizeZ * y
}
