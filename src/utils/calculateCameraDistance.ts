type Vector = {
  x: number
  y: number
  z: number
}

export function calculateCameraDistance(
  point1: Vector,
  point2: Vector,
  fov: number
): number {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  const dz = point2.z - point1.z
  const distanceBetweenPoints = Math.sqrt(dx * dx + dy * dy + dz * dz)

  const halfFOV = fov / 2
  const halfDiagonalDistance =
    Math.tan((halfFOV * Math.PI) / 180) * distanceBetweenPoints
  const distance = halfDiagonalDistance / Math.sin((halfFOV * Math.PI) / 180)

  return distance
}
