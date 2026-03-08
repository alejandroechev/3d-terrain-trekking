import { useMemo } from 'react'
import * as THREE from 'three'
import type { GPXRoute } from '../../domain/gpx/gpx-parser'
import type { BBox } from '../../domain/elevation/elevation'
import { projectRouteToMesh } from '../../domain/elevation/route-projection'
import { segmentGradients } from '../../domain/elevation/route-projection'
import { gradientToColor } from '../../domain/elevation/gradient-color'

interface Route3DProps {
  route: GPXRoute
  bbox: BBox
  meshSize: number
  exaggeration: number
}

export function Route3D({ route, bbox, meshSize, exaggeration }: Route3DProps) {
  const lineObj = useMemo(() => {
    const positions = projectRouteToMesh(route.points, bbox, {
      meshSize,
      exaggeration: exaggeration / 1000,
    })

    // Lift route slightly above terrain to prevent z-fighting
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += 0.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Per-vertex colors based on segment gradient
    const gradients = segmentGradients(route.points)
    const colorArr = new Float32Array(route.points.length * 3)
    for (let i = 0; i < route.points.length; i++) {
      const grade = i < gradients.length ? gradients[i] : (gradients[gradients.length - 1] ?? 0)
      const rgb = gradientToColor(grade)
      colorArr[i * 3] = rgb.r
      colorArr[i * 3 + 1] = rgb.g
      colorArr[i * 3 + 2] = rgb.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3))

    const material = new THREE.LineBasicMaterial({ vertexColors: true })
    return new THREE.Line(geo, material)
  }, [route, bbox, meshSize, exaggeration])

  return <primitive object={lineObj} />
}
